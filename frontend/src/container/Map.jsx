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

// Fix leaflet default marker icon broken in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom glowing marker icon
const pulseIcon = L.divIcon({
    className: "",
    html: `<div style="
        width:18px;height:18px;
        background:#4C9BFF;
        border-radius:50%;
        border:3px solid #fff;
        box-shadow:0 0 0 4px rgba(76,155,255,0.4);
        animation:mapPulse 1.5s infinite;
    "></div>
    <style>
        @keyframes mapPulse {
            0%   { box-shadow:0 0 0 0   rgba(76,155,255,0.6); }
            70%  { box-shadow:0 0 0 10px rgba(76,155,255,0);   }
            100% { box-shadow:0 0 0 0   rgba(76,155,255,0);    }
        }
    </style>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

function MapView({ center, zoom }) {
    const map = useMap();
    const prevCenter = useRef(null);
    useEffect(() => {
        if (!center) return;
        const same = prevCenter.current &&
            prevCenter.current[0] === center[0] &&
            prevCenter.current[1] === center[1];
        if (!same) {
            map.flyTo(center, zoom, { duration: 1.2 });
            prevCenter.current = center;
        }
    }, [center, zoom]);
    return null;
}

function MapControls({ center, zoom }) {
    const map = useMap();
    return (
        <div className="map-controls">
            <button onClick={() => map.zoomIn()} aria-label="Zoom in">+</button>
            <button onClick={() => map.zoomOut()} aria-label="Zoom out">−</button>
            <button onClick={() => map.flyTo(center, zoom, { duration: 1 })} aria-label="Reset">➤</button>
        </div>
    );
}

function getWeatherImage(conditionText) {
    const c = (conditionText || '').toLowerCase();
    if (c.includes('rain'))                              return '/image/raincloud.webp';
    if (c.includes('partly cloudy'))                     return '/image/cloudsun.png';
    if (c.includes('sunny') || c.includes('clear'))      return '/image/sun.png';
    if (c.includes('cloud') || c.includes('overcast') ||
        c.includes('mist')  || c.includes('fog'))        return '/image/cloud.webp';
    return '/image/cloud.webp';
}

function Map({ search, variant }) {
    const [center, setCenter]       = useState([20, 0]);
    const [zoom, setZoom]           = useState(2);
    const [markerPos, setMarkerPos] = useState(null);
    const [mapReady, setMapReady]   = useState(false);
    const [weather, setWeather]     = useState(null);   // Map's own local weather state
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState('');

    useEffect(() => {
        if (!search || !search.trim()) {
            setMarkerPos(null);
            setCenter([20, 0]);
            setZoom(2);
            setWeather(null);
            setError('');
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError('');

        fetch(`http://localhost:3000/api/v1/weather/getweather?city=${encodeURIComponent(search.trim())}`)
            .then(r => r.json())
            .then(res => {
                if (cancelled) return;
                if (res.success && res.data) {
                    const data = res.data;
                    setWeather(data);
                    const lat = data.location?.lat;
                    const lon = data.location?.lon;
                    if (lat && lon) {
                        setCenter([lat, lon]);
                        setMarkerPos([lat, lon]);
                        setZoom(10);
                    }
                } else {
                    setError(`No data for "${search}"`);
                    setWeather(null);
                }
            })
            .catch(() => {
                if (!cancelled) setError('Failed to load weather data');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [search]);

    const current       = weather?.current;
    const location      = weather?.location;
    const conditionText = current?.condition?.text || '';
    const weatherImg    = getWeatherImage(conditionText);
    const isSuncloud    = conditionText.toLowerCase().includes('partly cloudy');

    const isCelsius  = variant?.temp !== 'Fahrenhit';
    const tempUnit   = isCelsius ? '°C' : '°F';
    const temp       = current ? Math.round(isCelsius ? current.temp_c      : current.temp_f)      : null;
    const feelsLike  = current ? Math.round(isCelsius ? current.feelslike_c : current.feelslike_f) : null;

    return (
        <div className="weather-map w-full h-full">
            <section className="map-section relative flex-1 min-w-0 text-white h-full">

                {/* Detail card — rendered outside MapContainer so z-index is never clipped */}
                {search && (
                    <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 9999 }}
                        className="bg-[#202B3B] text-white rounded-2xl p-4 shadow-xl border border-white/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2 text-white/50 text-sm px-2 py-1">
                                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20"/>
                                </svg>
                                Loading weather...
                            </div>
                        ) : error ? (
                            <p className="text-red-400 text-sm">{error}</p>
                        ) : current && location ? (
                            <>
                                {/* Header row */}
                                <div className="flex items-center gap-3">
                                    <img
                                        src={weatherImg}
                                        className={isSuncloud ? 'suncloud-icone' : 'weather-icone'}
                                        alt={conditionText}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-base font-bold leading-tight truncate">{location.name}</h2>
                                        <p className="text-white/50 text-xs">{location.country}</p>
                                    </div>
                                    <div className="flex items-start ml-2">
                                        <span className="text-3xl font-bold">{temp}</span>
                                        <span className="text-sm mt-1">{tempUnit}</span>
                                    </div>
                                </div>

                                <p className="text-white/50 text-xs mt-1 italic">{conditionText}</p>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs">
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
                            </>
                        ) : null}
                    </div>
                )}

                <MapContainer
                    center={center}
                    zoom={zoom}
                    zoomControl={false}
                    scrollWheelZoom
                    className="leaflet-map"
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
                                <strong>{location?.name || search}</strong><br />
                                {current
                                    ? `${temp}${tempUnit} — ${conditionText}`
                                    : 'Loading...'}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </section>
        </div>
    );
}

export default Map;
