/**
 * Returns { image, classname } based on condition text and icon URL.
 * Works with both WeatherAPI and Open-Meteo condition texts.
 */
export function getWeatherImage(conditionText = '', iconUrl = '', isDay = true) {
    const c = conditionText.toLowerCase().trim();
    const icon = iconUrl.toLowerCase();

    // Night icons
    if (!isDay || icon.includes('/night/')) {
        if (c.includes('clear') || c.includes('sunny')) {
            return { image: '/image/cloudmoon.webp', classname: 'weather-icone' };
        }
        return { image: '/image/cloud.webp', classname: 'weather-icone' };
    }

    // Rain / drizzle / showers
    if (
        c.includes('rain') ||
        c.includes('drizzle') ||
        c.includes('shower') ||
        c.includes('sleet')
    ) {
        return { image: '/image/raincloud.webp', classname: 'weather-icone' };
    }

    // Thunderstorm
    if (c.includes('thunder') || c.includes('storm')) {
        return { image: '/image/raincloud.webp', classname: 'weather-icone' };
    }

    // Partly cloudy
    if (c.includes('partly cloudy') || c.includes('mostly clear')) {
        return { image: '/image/cloudsun.png', classname: 'suncloud-icone' };
    }

    // Sunny / clear
    if (c.includes('sunny') || c.includes('clear')) {
        return { image: '/image/sun.png', classname: 'weather-icone' };
    }

    // Cloudy / overcast / haze / fog / mist / smoke / snow
    if (
        c.includes('cloud') ||
        c.includes('overcast') ||
        c.includes('haze') ||
        c.includes('fog') ||
        c.includes('mist') ||
        c.includes('smoke') ||
        c.includes('smoky') ||
        c.includes('snow') ||
        c.includes('blizzard') ||
        c.includes('ice')
    ) {
        return { image: '/image/cloud.webp', classname: 'weather-icone' };
    }

    // Default fallback
    return { image: '/image/cloud.webp', classname: 'weather-icone' };
}
