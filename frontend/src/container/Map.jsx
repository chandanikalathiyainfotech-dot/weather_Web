import React, { useState, useEffect, useRef } from "react";
import {
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const pulseIcon = L.divIcon({
    className: "",
    html: `<div style="
        width:16px;height:16px;
        background:#4C9BFF;border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 4px rgba(76,155,255,0.4);
        animation:mapPulse 1.5s infinite;
    "></div>
    <style>
        @keyframes mapPulse{
            0%  {box-shadow:0 0 0 0   rgba(76,155,255,0.6);}
            70% {box-shadow:0 0 0 10px rgba(76,155,255,0);}
            100%{box-shadow:0 0 0 0   rgba(76,155,255,0);}
        }
    </style>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

function MapView({ center, zoom }) {
    const map  = useMap();
    const prev = useRef(null);
    useEffect(() => {
        if (!center) return;
        const same =
            prev.current &&
            prev.current[0] === center[0] &&
            prev.current[1] === center[1];
        if (!same) {
            map.flyTo(center, zoom, { duration: 1.2 });
            prev.current = center;
        }
    }, [center, zoom]);
    return null;
}

function MapControls({ center, zoom }) {
    const map = useMap();
    return (
        <div className="map-controls">
            <button onClick={() => map.zoomIn()}>+</button>
            <button onClick={() => map.zoomOut()}>−</button>
            <button onClick={() => map.flyTo(center, zoom, { duration: 1 })}>➤</button>
        </div>
    );
}

function getWeatherImage(conditionText) {
    const c = (conditionText || '').toLowerCase();
    if (c.includes('rain'))                                        return '/image/raincloud.webp';
    if (c.includes('partly cloudy'))                               return '/image/cloudsun.png';
    if (c.includes('sunny') || c.includes('clear'))                return '/image/sun.png';
    if (c.includes('cloud') || c.includes('overcast') ||
        c.includes('mist')  || c.includes('fog'))                  return '/image/cloud.webp';
    return '/image/cloud.webp';
}

function Map({ search: searchProp, variant }) {
    const [inputVal,   setInputVal]   = useState(searchProp || '');
    const [activeCity, setActiveCity] = useState(searchProp || '');
    const [center,     setCenter]     = useState([20, 0]);
    const [zoom,       setZoom]       = useState(2);
    const [markerPos,  setMarkerPos]  = useState(null);
    const [mapReady,   setMapReady]   = useState(false);
    const [weather,    setWeather]    = useState(null);
    const [loading,    setLoading]    = useState(false);
    const [error,      setError]      = useState('');
    const [cardOpen,   setCardOpen]   = useState(true);   // collapsible on mobile

    // Sync parent-selected city into local state
    useEffect(() => {
        if (searchProp && searchProp !== activeCity) {
            setInputVal(searchProp);
            setActiveCity(searchProp);
            setCardOpen(true);
        }
    }, [searchProp]);

    // Fetch weather on city change
    useEffect(() => {
        if (!activeCity?.trim()) {
            setMarkerPos(null); setCenter([20, 0]); setZoom(2);
            setWeather(null);   setError('');
            return;
        }
        let cancelled = false;
        setLoading(true); setError('');

        fetch(`http://localhost:3000/api/v1/weather/getweather?city=${encodeURIComponent(activeCity.trim())}`)
            .then(r => r.json())
            .then(res => {
                if (cancelled) return;
                if (res.success && res.data) {
                    const d = res.data;
                    setWeather(d);
                    const lat = d.location?.lat;
                    const lon = d.location?.lon;
                    if (lat && lon) {
                        setCenter([lat, lon]);
                        setMarkerPos([lat, lon]);
                        setZoom(10);
                    }
                } else {
                    setError(`No data for "${activeCity}"`);
                    setWeather(null);
                }
            })
            .catch(() => { if (!cancelled) setError('Failed to load weather'); })
            .finally(() => { if (!cancelled) setLoading(false); });

        return () => { cancelled = true; };
    }, [activeCity]);

    const current       = weather?.current;
    const location      = weather?.location;
    const conditionText = current?.condition?.text || '';
    const weatherImg    = getWeatherImage(conditionText);
    const isSuncloud    = conditionText.toLowerCase().includes('partly cloudy');
    const isCelsius     = variant?.temp !== 'Fahrenhit';
    const tempUnit      = isCelsius ? '°C' : '°F';
    const temp          = current ? Math.round(isCelsius ? current.temp_c      : current.temp_f)      : null;
    const feelsLike     = current ? Math.round(isCelsius ? current.feelslike_c : current.feelslike_f) : null;

    return (
        <div className="flex flex-col w-full h-full">

            {/* ── Search bar (Map's own, full width) ── */}
            <div className="relative z-[99999] w-full pb-2 shrink-0">
                <input
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const v = inputVal.trim();
                            if (v) { setActiveCity(v); setCardOpen(true); }
                        }
                    }}
                    placeholder="Search city on map..."
                    className="w-full sm:w-[70%] lg:w-[60%] text-white bg-[#202B3B]
                               px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none
                               text-sm sm:text-base"
                />
            </div>

            {/* ── Map + overlay card ── */}
            <div className="relative flex-1 min-h-0 w-full rounded-2xl overflow-hidden">


                {/* Weather card overlay */}
                {activeCity && (
                    <div
                        style={{ zIndex: 9999 }}
                        className="absolute top-3 left-3 sm:top-4 sm:left-4
                                   bg-[#202B3B]/95 backdrop-blur-sm text-white
                                   rounded-xl sm:rounded-2xl shadow-xl border border-white/10
                                   w-[calc(100%-24px)] sm:w-auto sm:max-w-[260px]"
                    >
                        {/* Card header — always visible, tap to expand/collapse on mobile */}
                        <div
                            className="flex items-center gap-2 p-3 sm:p-4 cursor-pointer select-none"
                            onClick={() => setCardOpen(o => !o)}
                        >
                            {loading ? (
                                <svg className="animate-spin w-4 h-4 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
                                </svg>
                            ) : current ? (
                                <img
                                    src={weatherImg}
                                    className={`shrink-0 ${isSuncloud ? 'suncloud-icone' : 'weather-icone'}`}
                                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                                    alt={conditionText}
                                />
                            ) : null}

                            <div className="flex-1 min-w-0">
                                <p className="text-sm sm:text-base font-bold leading-tight truncate">
                                    {loading ? 'Loading…' : error ? error : (location?.name || activeCity)}
                                </p>
                                {!loading && !error && location && (
                                    <p className="text-white/50 text-[10px] sm:text-xs truncate">{location.country}</p>
                                )}
                            </div>

                            {!loading && !error && current && (
                                <div className="flex items-start shrink-0 ml-1">
                                    <span className="text-xl sm:text-2xl font-bold">{temp}</span>
                                    <span className="text-xs mt-0.5">{tempUnit}</span>
                                </div>
                            )}

                            {/* Chevron */}
                            <svg
                                className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${cardOpen ? 'rotate-180' : ''}`}
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Expandable detail body */}
                        {cardOpen && !loading && !error && current && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-white/10">
                                <p className="text-white/40 text-[10px] sm:text-xs italic mt-2 mb-2">{conditionText}</p>
                                <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1 text-[11px] sm:text-xs">
                                    <span className="text-white/50">💧 Humidity</span>
                                    <span className="text-white font-semibold">{current.humidity}%</span>
                                    <span className="text-white/50">💨 Wind</span>
                                    <span className="text-white font-semibold">{current.wind_kph} km/h</span>
                                    <span className="text-white/50">🌡 Feels like</span>
                                    <span className="text-white font-semibold">{feelsLike}{tempUnit}</span>
                                    <span className="text-white/50">☁️ Cloud</span>
                                    <span className="text-white font-semibold">{current.cloud}%</span>
                                    <span className="text-white/50">👁 Visibility</span>
                                    <span className="text-white font-semibold">{current.vis_km} km</span>
                                    <span className="text-white/50">🌬 Pressure</span>
                                    <span className="text-white font-semibold">{current.pressure_mb} mb</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Leaflet map */}
                <MapContainer
                    center={center}
                    zoom={zoom}
                    zoomControl={false}
                    scrollWheelZoom
                    style={{ width: '100%', height: '100%' }}
                    whenReady={() => setMapReady(true)}
                >
                    {mapReady && <MapView center={center} zoom={zoom} />}
                    <MapControls center={center} zoom={zoom} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {markerPos && (
                        <Marker position={markerPos} icon={pulseIcon}>
                            <Popup>
                                <strong>{location?.name || activeCity}</strong><br />
                                {current ? `${temp}${tempUnit} — ${conditionText}` : 'Loading...'}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}

export default Map;
