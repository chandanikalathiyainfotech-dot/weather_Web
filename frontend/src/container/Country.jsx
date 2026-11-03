import React, { useState, useEffect } from "react";

function Country() {
    const [coords, setCoords] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState("Loading location...");

    const requestLocation = () => {
        if (!navigator.geolocation) {
            fetchIpLocation();
            return;
        }
        setLoading(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords(pos.coords);
                setLoading(false);
            },
            () => {
                fetchIpLocation();
            },
            { enableHighAccuracy: false, timeout: 10000 }
        );
    };

    const fetchIpLocation = async () => {
        try {
            const res = await fetch("https://ipwho.is/");
            const data = await res.json();  

            if (data.success && data.latitude && data.longitude) {
                setCoords({
                    latitude: data.latitude,
                    longitude: data.longitude,
                    altitude: null,
                    heading: null,
                    speed: null,
                });
                setError(null);
            } else {
                setError({ message: "Unable to determine location." });
            }
        } catch (e) {
            setError({ message: "Unable to determine location." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        requestLocation();
    }, []);

    useEffect(() => {
        // 2. Once coordinates are available, fetch the city name
        if (coords) {
            const { latitude, longitude } = coords;

            // Using OpenStreetMap's free reverse geocoding API
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, {
                headers: { "Accept-Language": "en" },
            })
                .then((res) => res.json())
                .then((data) => {
                    // Extract city, town, or village from the address object
                    const addr = data.address || {};
                    const cityName = addr.city || addr.town || addr.village || addr.county || "Unknown City";
                    setCity(cityName);
                })
                .catch((err) => {
                    console.error("Error fetching city:", err);
                    setCity("Error retrieving city name");
                });
        }
    }, [coords]);

    if (loading && !coords) {
        return <div>Getting location data...</div>;
    }

    if (error && !coords) {
        return (
            <div>
                <h3>Location access is disabled</h3>
                <p>{error.message || "Please enable location permissions in your browser."}</p>
                <button onClick={requestLocation}>Retry location</button>
            </div>
        );
    }

    if (!coords) {
        return <div>Getting location data...</div>;
    }

    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td>Latitude</td>
                        <td>{coords.latitude}</td>
                    </tr>
                    <tr>
                        <td>Longitude</td>
                        <td>{coords.longitude}</td>
                    </tr>
                    <tr>
                        <td>Altitude</td>
                        <td>{coords.altitude ?? "Not available"}</td>
                    </tr>
                    <tr>
                        <td>Heading</td>
                        <td>{coords.heading ?? "Not available"}</td>
                    </tr>
                    <tr>
                        <td>Speed</td>
                        <td>{coords.speed ?? "Not available"}</td>
                    </tr>
                </tbody>
            </table>
            {error && (
                <p>
                    Error: {error.message}
                </p>
            )}

            <div>
                <h3>Your current city is: <strong>{city}</strong></h3>
            </div>
        </>
    );
}

export default Country;