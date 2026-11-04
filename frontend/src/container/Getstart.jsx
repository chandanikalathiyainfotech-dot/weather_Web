import React, { useEffect } from 'react'
import { FaArrowRight, FaRegSnowflake } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { IoSunnyOutline } from "react-icons/io5";


function Getstart() {
    const navigate = useNavigate()

    function handlenavigate() {
        navigate('/siderbar')
    }

    function getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'))
                return
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    })
                },
                (error) => reject(error),
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
            const address = data.address
            return (
                address?.city ||
                address?.town ||
                address?.village ||
                address?.county ||
                address?.state ||
                'Unknown Location'
            )
        } catch (err) {
            console.error('Reverse geocode failed:', err)
            return null
        }
    }

    async function handleGetStart() {
        const saved = localStorage.getItem('userLocation')
        const initialCity = saved ? JSON.parse(saved).city : 'New York'
        localStorage.setItem('firstRun', 'false')
        navigate('/siderbar', { state: { searchCity: initialCity }, replace: true })

        // detect location in background, then update
        ;(async () => {
            try {
                const location = await getLocation()
                const city = await reverseGeocode(location.lat, location.lon)
                const finalCity = city || 'New York'
                localStorage.setItem('userLocation', JSON.stringify({
                    lat: location.lat,
                    lon: location.lon,
                    city: finalCity,
                    timestamp: Date.now()
                }))
                navigate('/siderbar', { state: { searchCity: finalCity }, replace: true })
            } catch (err) {
                try {
                    const res = await fetch("https://ipwho.is/")
                    const data = await res.json()
                    if (data.success && data.latitude && data.longitude) {
                        const city = await reverseGeocode(data.latitude, data.longitude)
                        const finalCity = city || data.city || 'New York'
                        localStorage.setItem('userLocation', JSON.stringify({ lat: data.latitude, lon: data.longitude, city: finalCity, timestamp: Date.now() }))
                        navigate('/siderbar', { state: { searchCity: finalCity }, replace: true })
                        return
                    }
                } catch (e) { }
            }
        })()
    }

    // navigate only on button click


    function AnimatedUmbrella({ className = "" }) {

        const drops = [
            { left: "20%", delay: "0s", impact: "30%" },
            { left: "38%", delay: "0.7s", impact: "45%" },
            { left: "58%", delay: "0.3s", impact: "35%" },
            { left: "78%", delay: "1s", impact: "50%" },
            { left: "32%", delay: "1.4s", impact: "40%" },
            { left: "70%", delay: "0.5s", impact: "32%" },
        ];

        return (
            <div className={`umbrella-wrapper ${className}`}>
                <img
                    src="/image/img1%20(1).png"
                    alt="Umbrella in the rain"
                    className="umbrella-image"
                />

                {/* Falling rain */}
                <div className="top-rain">
                    {drops.map((drop, i) => (
                        <div
                            key={i}
                            className="rain-drop-group"
                            style={{
                                left: drop.left,
                                "--delay": drop.delay,
                                "--impact": drop.impact,
                            }}
                        >
                            <svg className="top-raindrop" viewBox="0 0 20 28">
                                <defs>
                                    <linearGradient
                                        id={`rainGradient-${i}`}
                                        x1="0%"
                                        y1="0%"
                                        x2="100%"
                                        y2="100%"
                                    >
                                        <stop offset="0%" stopColor="#00DDEB" />
                                        <stop offset="100%" stopColor="#087F8C" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M10 0 C8 4 1 12 1 17 A9 9 0 0 0 19 17 C19 12 12 4 10 0 Z"
                                    fill={`url(#rainGradient-${i})`}
                                />
                            </svg>

                            <span className="impact-splash">
                                <i />
                                <i />
                                <i />
                            </span>
                        </div>
                    ))}
                </div>

                {/* ADD WATER SPLASH HERE */}
                <div className="bottom-splash">
                    <span className="splash-ring ring-one" />
                    <span className="splash-ring ring-two" />
                    <span className="splash-ring ring-three" />

                    {Array.from({ length: 8 }, (_, j) => (
                        <span
                            key={j}
                            className="splash-particle"
                            style={{
                                "--angle": `${j * 45}deg`,
                            }}
                        />
                    ))}
                </div>

            </div>
        );
    }

    function SnowAnimation() {
        return (
            <div className="relative flex h-[720px] w-[640px] items-center justify-center overflow-hidden rounded-3xl bg-[#202B3B]">

                {/* Snowflake */}
                <FaRegSnowflake
                    className="snowflake h-80 w-80 text-[#43B2CD]"
                />

                {/* Snow dots */}
                <span className="snow-dot dot-1" />
                <span className="snow-dot dot-2" />
                <span className="snow-dot dot-3" />
                <span className="snow-dot dot-4" />
                <span className="snow-dot dot-5" />
                <span className="snow-dot dot-6" />
                <span className="snow-dot dot-7" />

            </div>
        );
    }

    const date = new Date();
    const month = date.getMonth() + 1;
    console.log(month, date.toLocaleString('default', { month: 'long' }))

    let mainimgpart;
    let smallimgpart;

    if (month >= 12 || month <= 2) {
        mainimgpart = <SnowAnimation className="h-80 w-80 text-[#43B2CD] " />
        smallimgpart = <FaRegSnowflake className="mx-auto mb-6 xl:mb-3 h-15 w-15 text-[#43B2CD]" />
        console.log('winter')
    } else if (month >= 3 && month <= 5) {
        mainimgpart = <IoSunnyOutline className="sun-icon h-80 w-80 text-[#43B2CD] " />
        smallimgpart = <IoSunnyOutline className="mx-auto mb-6 xl:mb-3 h-15 w-15 text-[#43B2CD]" />
    } else if (month >= 6 && month <= 9) {
        mainimgpart = <AnimatedUmbrella className="h-100 w-100" />
        smallimgpart = <img src='../../public/image/img1 (1).png' className="mx-auto mb-6 xl:mb-3 h-30 w-30 min-[576px]:h-50 min-[576px]:w-50 xl:h-30 xl:w-30" />
    } else if (month >= 10 && month <= 11) {
        mainimgpart = <AnimatedUmbrella className="h-100 w-100" />
        smallimgpart = <img src='../../public/image/img1 (1).png' className="mx-auto mb-6 xl:mb-3 h-30 w-30 min-[576px]:h-50 min-[576px]:w-50 xl:h-30 xl:w-30" />
    }

    return (
        <main>
            <div className='bg-background min-h-screen w-full px-10 xl:px-30'>
                <div className='flex items-center justify-center min-[992px]:justify-start xl:justify-center min-h-screen'>
                    <div className='bg-[#202B3B] w-[640px] h-[720px] px-20 py-30 xl:py-40 xl:px-30 rounded-3xl hidden min-[992px]:flex justify-center items-center'>
                        {/* left side animated image */}
                        {mainimgpart}
                    </div>

                    <div className='text-white flex flex-col justify-center text-center  xl:ml-40 2xl:ml-50 h-fit py-40 '>
                        {/* right side small image */}
                        {smallimgpart}

                        <h1 className='text-5xl xl:text-6xl font-bold mt-10'>Breeze</h1>
                        <p className='text-xl text-white/60 mt-3'>Weather App</p>

                        <button className='bg-secondary p-3 rounded-3xl text-xl mt-18 hidden min-[576px]:block' onClick={handleGetStart}>Get Start</button>
                        <button className='bg-secondary p-3 h-fit w-fit rounded-3xl text-xl mt-12 mx-auto block min-[576px]:hidden' onClick={handleGetStart}><FaArrowRight /></button>
                    </div>
                </div>

            </div>
        </main>
    )
}

export default Getstart   