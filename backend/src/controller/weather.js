
const axios = require('axios');

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// Open-Meteo WMO code → condition text + icon path mapping
function wmoToCondition(code, isDay) {
    const map = {
        0:  { text: 'Clear',           icon: isDay ? '/day/113' : '/night/113' },
        1:  { text: 'Mostly Clear',    icon: isDay ? '/day/116' : '/night/116' },
        2:  { text: 'Partly Cloudy',   icon: isDay ? '/day/116' : '/night/116' },
        3:  { text: 'Overcast',        icon: '/day/122' },
        45: { text: 'Fog',             icon: '/day/143' },
        48: { text: 'Icy Fog',         icon: '/day/143' },
        51: { text: 'Light Drizzle',   icon: '/day/266' },
        53: { text: 'Drizzle',         icon: '/day/266' },
        55: { text: 'Heavy Drizzle',   icon: '/day/266' },
        61: { text: 'Light Rain',      icon: '/day/296' },
        63: { text: 'Rain',            icon: '/day/302' },
        65: { text: 'Heavy Rain',      icon: '/day/308' },
        71: { text: 'Light Snow',      icon: '/day/326' },
        73: { text: 'Snow',            icon: '/day/332' },
        75: { text: 'Heavy Snow',      icon: '/day/338' },
        80: { text: 'Light Showers',   icon: '/day/353' },
        81: { text: 'Showers',         icon: '/day/356' },
        82: { text: 'Heavy Showers',   icon: '/day/359' },
        95: { text: 'Thunderstorm',    icon: '/day/389' },
        96: { text: 'Thunderstorm',    icon: '/day/389' },
        99: { text: 'Thunderstorm',    icon: '/day/389' },
    };
    return map[code] || { text: 'Unknown', icon: '/day/113' };
}

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
            return res.status(500).json({
                success: false,
                data: [],
                message: 'Weather API key is not configured'
            });
        }

        const cityKey = city.trim().toLowerCase() + '_7';
        const cached = cache.get(cityKey);

        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return res.status(200).json({
                success: true,
                data: cached.data,
                message: 'Weather data retrieved successfully (cached)'
            });
        }

        // Step 1: WeatherAPI — current weather + 3-day forecast (free plan)
        const weatherRes = await axios.get(
            'https://api.weatherapi.com/v1/forecast.json',
            {
                params: { key: apikey, q: city.trim(), days: 3 },
                timeout: 10000
            }
        );
        const weatherData = weatherRes.data;
        const { lat, lon } = weatherData.location;

        // Step 2: Open-Meteo — free 7-day daily forecast using lat/lon from WeatherAPI
        const meteoRes = await axios.get(
            'https://api.open-meteo.com/v1/forecast',
            {
                params: {
                    latitude: lat,
                    longitude: lon,
                    daily: 'weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum',
                    temperature_unit: 'celsius',
                    timezone: 'auto',
                    forecast_days: 7
                },
                timeout: 10000
            }
        );
        const meteo = meteoRes.data.daily;

        // Step 3: Build 7-day forecast array from Open-Meteo
        const sevenDayForecast = meteo.time.map((date, i) => {
            const code = meteo.weathercode[i];
            const cond = wmoToCondition(code, true);
            const maxC = meteo.temperature_2m_max[i];
            const minC = meteo.temperature_2m_min[i];
            // Convert to Fahrenheit
            const maxF = parseFloat(((maxC * 9/5) + 32).toFixed(1));
            const minF = parseFloat(((minC * 9/5) + 32).toFixed(1));

            return {
                date,
                day: {
                    maxtemp_c: maxC,
                    mintemp_c: minC,
                    maxtemp_f: maxF,
                    mintemp_f: minF,
                    condition: {
                        text: cond.text,
                        icon: `//cdn.weatherapi.com/weather/64x64${cond.icon}.png`,
                        code
                    }
                },
                // Keep hourly from WeatherAPI for days 1-3, empty for rest
                hour: weatherData.forecast.forecastday[i]?.hour || [],
                astro: weatherData.forecast.forecastday[i]?.astro || {}
            };
        });

        // Step 4: Merge — replace WeatherAPI forecastday with 7-day Open-Meteo data
        const merged = {
            ...weatherData,
            forecast: {
                forecastday: sevenDayForecast
            }
        };

        cache.set(cityKey, { data: merged, timestamp: Date.now() });

        return res.status(200).json({
            success: true,
            data: merged,
            message: 'Weather data retrieved successfully'
        });

    } catch (error) {
        console.error('WeatherAPI error:', error.response?.data || error.message);
        const status = error.response?.status;
        return res.status(status === 400 ? 400 : 500).json({
            success: false,
            data: [],
            message: error.response?.data?.error?.message || 'Failed to fetch weather data'
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
            const key = city.toString().trim().toLowerCase() + '_7';
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
                            days: 7
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
