
const axios = require('axios');

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const getWeaterObj = async (req, res) => {
    try {
        const { city } = req.query;
        const apikey = process.env.APP_KEY;

        if (!city || typeof city !== 'string' || !city.trim()) {
            return res.status(400).json({
                success: false,
                data: [],
                message: 'Please provide a city name'
            });
        }

        if (!apikey) {
            console.error('APP_KEY is missing');

            return res.status(500).json({
                success: false,
                data: [],
                message: 'Weather API key is not configured'
            });
        }

        const cityKey = city.trim().toLowerCase();
        const cached = cache.get(cityKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.status(200).json({
                success: true,
                data: cached.data,
                message: 'Weather data retrieved successfully (cached)'
            });
        }

        const response = await axios.get(
            'https://api.weatherapi.com/v1/forecast.json',
            {
                params: {
                    key: apikey,
                    q: city.trim(),
                    days: 7
                },
                timeout: 10000
            }
        );

        cache.set(cityKey, {
            data: response.data,
            timestamp: Date.now()
        });

        return res.status(200).json({
            success: true,
            data: response.data,
            message: 'Weather data retrieved successfully'
        });
    } catch (error) {
        console.error(
            'WeatherAPI error:',
            error.response?.data || error.message
        );

        const status = error.response?.status;

        return res.status(status === 400 ? 400 : 500).json({
            success: false,
            data: [],
            message:
                error.response?.data?.error?.message ||
                'Failed to fetch weather data'
        });
    }
};

const getmultiplectyWeather = async (req, res) => {
    try {

        const apikey = process.env.APP_KEY;
        let cities = req.query['city[]'];
        console.log("cities",cities)

        if (!apikey) {
            console.error("APP_KEY is missing");

            return res.status(500).json({
                success: false,
                data: [],
                message: "Weather API key is not configured"
            });
        }

        if (!Array.isArray(cities)) {
            cities = [cities]
        }

        const cacheMap = cache;
        const CACHE_TTL_MULTI = 10 * 60 * 1000;
        const results = [];
        const toFetch = [];

        cities.forEach((city) => {
            if (!city) return;
            const key = city.toString().trim().toLowerCase();
            const cached = cacheMap.get(key);
            if (cached && Date.now() - cached.timestamp < CACHE_TTL_MULTI) {
                results.push({ cached: true, data: cached.data, key, city });
            } else {
                toFetch.push({ key, city: city.toString().trim() });
            }
        });

        const fetched = await Promise.all(
            toFetch.map(({ key, city }) =>
                axios.get(
                    "https://api.weatherapi.com/v1/forecast.json",
                    {
                        params: {
                            key: apikey,
                            q: city,
                            days: 3
                        },
                        timeout: 10000
                    }
                ).then((response) => {
                    cacheMap.set(key, { data: response.data, timestamp: Date.now() });
                    return response;
                }).catch((err) => {
                    throw err;
                })
            )
        );

        const allResponses = [...results.filter(r => r.cached).map(r => ({ data: r.data })), ...fetched];

        const weatherData = allResponses.map(response => {
            const data = response.data;

            return {
                city: data.location.name,
                country: data.location.country,
                temperaturec: data.current.temp_c,
                temperaturef: data.current.temp_f,
                condition: data.current.condition.text,
                humidity: data.current.humidity,
                forecast: data.forecast.forecastday.map(day => ({
                    date: day.date,
                    maxTempc: day.day.maxtemp_c,
                    minTempc: day.day.mintemp_c,
                    maxTempf: day.day.maxtemp_f,
                    minTempf: day.day.mintemp_f,
                    condition: day.day.condition.text
                }))
            };
        });

        console.log(JSON.stringify(weatherData, null, 2));

        return res.status(200).json({
            success: true,
            data: weatherData,
            message: "Weather data retrieved successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error at getmultiplectyWeather ' + error.message
        })
    }
}

module.exports = {
    getWeaterObj,
    getmultiplectyWeather
};
