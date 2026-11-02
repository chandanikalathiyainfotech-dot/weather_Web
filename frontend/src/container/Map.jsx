
import React from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
    Rectangle,
    Tooltip
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RxDot } from "react-icons/rx";

const cities = [
    { name: "Bilbao", position: [43.263, -2.935], temp: 27, icon: "🌧️" },
    { name: "Madrid", position: [40.4168, -3.7038], temp: 31, icon: "☀️" },
    { name: "Barcelona", position: [41.3874, 2.1686], temp: 27, icon: "☀️" },
    { name: "Malaga", position: [43.263, -2.935], temp: 33, icon: "🌤️" },
];

const weatherList = [
    { city: "Bilbao", temp: 27, time: "10:23", img: "/image/raincloud.webp", classname: "weather-icone" },
    { city: "Barcelona", temp: 29, time: "10:23", img: "/image/sun.png", classname: "weather-icone" },
    { city: "Madrid", temp: 31, time: "10:23", img: "/image/sun.png", classname: "weather-icone" },
    { city: "Malaga", temp: 33, time: "10:23", img: "/image/cloudsun.png", classname: "suncloud-icone" },
];

const cityIcon = L.divIcon({
    className: "city-dot",
    html: '<div class="map-dot"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

const bounds = [
    [39.5, -4.5],
    [41.0, -2.5],]

function MapControls() {
    const map = useMap();

    return (
        <div className="map-controls">
            <button onClick={() => map.zoomIn()} aria-label="Zoom in">+</button>
            <button onClick={() => map.zoomOut()} aria-label="Zoom out">−</button>
            <button onClick={() => map.setView([40.2, -3.5], 6)} aria-label="Reset map">
                ➤
            </button>
        </div>
    );
}

const now = new Date();

const yyyyMMdd = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
].join("");

const hour = String(now.getUTCHours()).padStart(2, "0");

console.log("UTC Date:", yyyyMMdd);
console.log("UTC Hour:", hour);


function Map() {
    return (
        <div className="weather-map  w-full h-full">
            <section className="map-section relative flex-1 min-w-0 text-white h-full min-[992px]:h-full">
                <MapContainer
                    center={[40.2, -3.5]}
                    zoom={3}
                    zoomControl={false}
                    scrollWheelZoom
                    className="leaflet-map"
                >
                    <MapControls />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        zIndex={1}
                    />
                    <TileLayer
                        url={`https://weathermaps.weatherapi.com/tmp2m/tiles/${yyyyMMdd}${hour}/{z}/{x}/{y}.png`}
                        opacity={0.50}
                    />

                    <Rectangle
                        bounds={bounds}
                        pathOptions={{
                            color: "red",
                            weight: 2,
                            fillOpacity: 0.1,
                        }}
                    >
                        <Tooltip>Selected region</Tooltip>
                    </Rectangle>
                </MapContainer>
            </section>
        </div>
    );
}

export default Map;
