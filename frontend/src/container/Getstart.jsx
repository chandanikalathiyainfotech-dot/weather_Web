import React, { useEffect } from 'react'
import { FaArrowRight, FaRegSnowflake } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { IoSunnyOutline } from "react-icons/io5";

function Getstart() {
    const navigate = useNavigate()

    function getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) { reject(new Error('Geolocation not supported')); return }
            navigator.geolocation.getCurrentPosition(
                (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
                (err) => reject(err),
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            )
        })
    }

    async function reverseGeocode(lat, lon) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
                { headers: { "Accept-Language": "en" } }
            )
            const data = await res.json()
            const a = data.address
            return a?.city || a?.town || a?.village || a?.county || a?.state || null
        } catch { return null }
    }

    async function handleGetStart() {
        const saved = localStorage.getItem('userLocation')
        const initialCity = saved ? JSON.parse(saved).city : 'New York'
        localStorage.setItem('firstRun', 'false')
        navigate('/siderbar', { state: { searchCity: initialCity }, replace: true })

        ;(async () => {
            try {
                const loc = await getLocation()
                const city = await reverseGeocode(loc.lat, loc.lon)
                const finalCity = city || 'New York'
                localStorage.setItem('userLocation', JSON.stringify({ lat: loc.lat, lon: loc.lon, city: finalCity, timestamp: Date.now() }))
                navigate('/siderbar', { state: { searchCity: finalCity }, replace: true })
            } catch {
                try {
                    const res = await fetch("https://ipwho.is/")
                    const data = await res.json()
                    if (data.success) {
                        const city = await reverseGeocode(data.latitude, data.longitude)
                        const finalCity = city || data.city || 'New York'
                        localStorage.setItem('userLocation', JSON.stringify({ lat: data.latitude, lon: data.longitude, city: finalCity, timestamp: Date.now() }))
                        navigate('/siderbar', { state: { searchCity: finalCity }, replace: true })
                    }
                } catch {}
            }
        })()
    }

    function AnimatedUmbrella({ className = "" }) {
        const drops = [
            { left: "20%", delay: "0s" }, { left: "38%", delay: "0.7s" },
            { left: "58%", delay: "0.3s" }, { left: "78%", delay: "1s" },
            { left: "32%", delay: "1.4s" }, { left: "70%", delay: "0.5s" },
        ]
        return (
            <div className={`umbrella-wrapper ${className}`}>
                <img src="/image/img1%20(1).png" alt="Umbrella in the rain" className="umbrella-image" />
                <div className="top-rain">
                    {drops.map((drop, i) => (
                        <div key={i} className="rain-drop-group" style={{ left: drop.left, "--delay": drop.delay }}>
                            <svg className="top-raindrop" viewBox="0 0 20 28">
                                <defs>
                                    <linearGradient id={`rg-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#00DDEB" />
                                        <stop offset="100%" stopColor="#087F8C" />
                                    </linearGradient>
                                </defs>
                                <path d="M10 0 C8 4 1 12 1 17 A9 9 0 0 0 19 17 C19 12 12 4 10 0 Z" fill={`url(#rg-${i})`} />
                            </svg>
                            <span className="impact-splash"><i /><i /><i /></span>
                        </div>
                    ))}
                </div>
                <div className="bottom-splash">
                    <span className="splash-ring ring-one" />
                    <span className="splash-ring ring-two" />
                    <span className="splash-ring ring-three" />
                    {Array.from({ length: 8 }, (_, j) => (
                        <span key={j} className="splash-particle" style={{ "--angle": `${j * 45}deg` }} />
                    ))}
                </div>
            </div>
        )
    }

    function SnowAnimation() {
        return (
            <div className="relative flex w-full max-w-[640px] h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] items-center justify-center overflow-hidden rounded-3xl bg-[#202B3B]">
                <FaRegSnowflake className="snowflake h-40 w-40 sm:h-56 sm:w-56 lg:h-72 lg:w-72 text-[#43B2CD]" />
                <span className="snow-dot dot-1" /><span className="snow-dot dot-2" />
                <span className="snow-dot dot-3" /><span className="snow-dot dot-4" />
                <span className="snow-dot dot-5" /><span className="snow-dot dot-6" />
                <span className="snow-dot dot-7" />
            </div>
        )
    }

    const month = new Date().getMonth() + 1

    let mainimgpart, smallimgpart

    if (month >= 12 || month <= 2) {
        mainimgpart = <SnowAnimation />
        smallimgpart = <FaRegSnowflake className="mx-auto mb-4 sm:mb-6 h-12 w-12 sm:h-16 sm:w-16 text-[#43B2CD]" />
    } else if (month >= 3 && month <= 5) {
        mainimgpart = (
            <div className="flex items-center justify-center w-full max-w-[640px] h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] rounded-3xl bg-[#202B3B]">
                <IoSunnyOutline className="sun-icon h-40 w-40 sm:h-56 sm:w-56 lg:h-72 lg:w-72 text-[#43B2CD]" />
            </div>
        )
        smallimgpart = <IoSunnyOutline className="mx-auto mb-4 sm:mb-6 h-12 w-12 sm:h-16 sm:w-16 text-[#43B2CD]" />
    } else {
        mainimgpart = (
            <div className="flex items-center justify-center w-full max-w-[640px] h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] rounded-3xl bg-[#202B3B]">
                <AnimatedUmbrella />
            </div>
        )
        smallimgpart = <img src="/image/img1%20(1).png" className="mx-auto mb-4 sm:mb-6 h-20 w-20 sm:h-28 sm:w-28 object-contain" alt="weather" />
    }

    return (
        <main className="bg-background min-h-screen w-full">
            <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 xl:gap-16 px-4 sm:px-8 lg:px-12 xl:px-20 py-10">

                {/* Left — animated illustration (hidden on small screens, shown at top on md) */}
                <div className="w-full max-w-[480px] lg:max-w-[520px] xl:max-w-[600px] hidden sm:flex items-center justify-center">
                    {mainimgpart}
                </div>

                {/* Right — text + CTA */}
                <div className="text-white flex flex-col items-center text-center w-full max-w-[400px]">

                    {/* Small icon visible on mobile */}
                    <div className="sm:hidden">
                        {smallimgpart}
                    </div>

                    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold">Breeze</h1>
                    <p className="text-lg sm:text-xl text-white/60 mt-2">Weather App</p>
                    <p className="text-sm text-white/40 mt-3 max-w-[280px]">
                        Real-time weather forecasts, air quality, and alerts — all in one place.
                    </p>

                    {/* Desktop button */}
                    <button
                        className="hidden sm:flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-3xl 
                        text-lg font-semibold mt-10 hover:opacity-90 transition-opacity"
                        onClick={handleGetStart}
                    >
                        Get Started <FaArrowRight />
                    </button>

                    {/* Mobile button */}
                    <button
                        className="sm:hidden mt-10 bg-secondary p-4 rounded-full text-white text-xl hover:opacity-90 transition-opacity"
                        onClick={handleGetStart}
                        aria-label="Get Started"
                    >
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </main>
    )
}

export default Getstart
