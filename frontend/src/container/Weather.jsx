import React, { useState } from "react";
import { RxDot } from "react-icons/rx";
import { FaCloudSun, FaSun, FaTemperatureFull, FaWind } from "react-icons/fa6";
import { IoWater } from "react-icons/io5";
import { BiDroplet } from "react-icons/bi";
import { MdVisibility } from "react-icons/md";
import { GiPressureCooker } from "react-icons/gi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { PiGaugeFill } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getWeather } from "../redux/slice/weather.slice";
import { getWeatherImage } from "../utils/weatherImage";

function Weather({ search, variant }) {

    //weather location city one not set city
    const [coords, setCoords] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [windspeed, setWindspeed] = useState('')
    const [pressure, setPressure] = useState('')
    const dispatch = useDispatch();
    const weatherdata = useSelector(state => state.weather)

    const current = weatherdata?.data?.current
    const forecast = weatherdata?.data?.forecast?.forecastday;
    const today = forecast?.[0]

    function windconvertor(selectwind, value_kmh) {
        switch (selectwind) {
            case 'km/h': return value_kmh;
            case 'm/s': return value_kmh / 3.6;
            case 'knots': return value_kmh / 1.852;
            default: throw new Error("Unsupported wind speed unit");
        }
    }
    function pressureConvetor(selectpre, value_in) {
        switch (selectpre) {
            case 'Inches': return value_in
            case 'mm': return value_in * 25.4
            case 'kPa': return value_in * 3.38639;
            case 'hPa': return value_in * 33.86389;
            default: throw new Error("Unsupported pressure speed unit");
        }
    }

    useEffect(() => {
        const wind = windconvertor(variant?.windspeed, current?.wind_kph)
        const Pressure = pressureConvetor(variant?.pressurre, today?.hour?.[0]?.pressure_in)
        setWindspeed(wind)
        setPressure(Pressure)
    }, [current, today])

    // Precipitation converter
    function precipConverter(unit, mm, inches) {
        if (unit === 'Inches') return { value: (inches ?? 0).toFixed(2), label: 'in' };
        return { value: (mm ?? 0).toFixed(1), label: 'mm' };
    }

    // Visibility/Distance converter
    function visConverter(unit, km, miles) {
        if (unit === 'miles') return { value: (miles ?? 0).toFixed(1), label: 'mi' };
        return { value: (km ?? 0).toFixed(1), label: 'km' };
    }

    const precip = precipConverter(variant?.precipitation, current?.precip_mm, current?.precip_in);
    const vis    = visConverter(variant?.distance, current?.vis_km, current?.vis_miles);

    useEffect(() => {
        if (search && search.trim()) {
            // search bar ya selected city — isko priority hai
            dispatch(getWeather(search));
            return;
        }
        // koi city select nahi — location se fetch karo
        if (coords) {
            dispatch(getWeather(`${coords.latitude},${coords.longitude}`));
        }
    }, [search, coords, dispatch]);

    const fetchIpLocation = async () => {
        // sirf tab run karo jab search empty ho
        if (search && search.trim()) return;
        try {
            const res = await fetch("https://ipwho.is/");
            const data = await res.json();
            if (data.success && data.latitude && data.longitude) {
                setCoords(prev => {
                    if (!prev) return { latitude: data.latitude, longitude: data.longitude };
                    return prev;
                });
            }
        } catch (e) { }
    };

    const requestGpsLocation = () => {
        // sirf tab run karo jab search empty ho
        if (search && search.trim()) return;
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            },
            () => { },
            { enableHighAccuracy: false, timeout: 10000 }
        );
    };

    useEffect(() => {
        // pehli baar mount pe — agar search nahi hai toh location fetch karo
        if (!search || !search.trim()) {
            fetchIpLocation();
            requestGpsLocation();
        }
    }, []); // only on mount

    // agar search baad mein aa jaaye (city select/search) toh location calls ruk jaayein
    // useEffect([search]) handles dispatch already above

    //location end

    console.log("props", search, variant)

    console.log("city", weatherdata?.data?.location, search)

    console.log(current)
    console.log("today", current)

    const todayforcast = [
        {
            time: '6:00 AM',
            temprature: '25',
            image: '/image/cloud.webp',
            classname: 'weather-icone'
        },
        {
            time: '9:00 AM',
            temprature: '28',
            image: '/image/cloudsun.png',
            classname: 'suncloud-icone'
        },
        {
            time: '12:00 PM',
            temprature: '28',
            image: '/image/sun.png',
            classname: 'weather-icone'
        },
        {
            time: '3:00 PM',
            temprature: '34',
            image: '/image/sun.png',
            classname: 'weather-icone'
        },
        {
            time: '6:00 PM',
            temprature: '32',
            image: '/image/sun.png',
            classname: 'weather-icone'
        },
        {
            time: '9:00 PM',
            temprature: '30',
            image: '/image/cloudsun.png',
            classname: 'suncloud-icone'
        },
        {
            time: '12:00 AM',
            temprature: '22',
            image: '/image/cloud.webp',
            classname: 'weather-icone'
        },
        {
            time: '6:00 AM',
            temprature: '25',
            image: '/image/cloud.webp',
            classname: 'weather-icone'
        },
    ]

    console.log("windspeed", windspeed, current?.wind_kph, today?.hour?.[0], Math.round(pressure * 100) / 100)

    return (
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 2xl:gap-7 w-full">
            {weatherdata?.data?.current ? (<>
                <div className="w-full lg:w-[60%] xl:w-[65%] 2xl:w-[70%] text-white">
                    {/* madrid */}
                    <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full sm:w-[80%] md:w-[85%] 2xl:w-[70%]  mx-auto mt-6 sm:mt-10 gap-6 sm:gap-0">
                        <div className="py-2 px-4 sm:px-6 md:px-10 text-center sm:text-left">
                            <h2 className="text-[28px] sm:text-[34px] font-bold">{weatherdata?.data?.location?.name}</h2>
                            <p className="text-white/70 mt-1">Chance of rain: {current?.chance_of_rain + '%'}</p>

                            <div className=" items-start mt-6 sm:mt-12 hidden sm:flex">
                                <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-bold hidden sm:block">
                                    {Math.round(variant?.temp === 'Celsius' ? current?.temp_c : current?.temp_f)}
                                </h1>
                                <span className="ml-1 text-xl sm:text-2xl font-semibold">°{variant?.temp === 'Celsius' ? 'C' : 'F'}</span>
                            </div>
                        </div>

                        <div>
                            <img src='/image/sun.png' className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] 2xl:w-[200px] 2xl:h-[200px]" />
                        </div>

                        <div className="flex items-start mt-6 sm:mt-12  sm:hidden ">
                            <h1 className="text-4xl font-bold">
                                {Math.round(variant?.temp === 'Celsius' ? current?.temp_c : current?.temp_f)}
                            </h1>
                            <span className="ml-1 text-xl font-semibold mt-1">°{variant?.temp === 'Celsius' ? 'C' : 'F'}</span>
                        </div>
                    </div>

                    {/* forecast */}
                    <div className="px-4 sm:px-6 md:px-7 py-6 sm:py-8 bg-[#202B3B] rounded-2xl mt-6 sm:mt-10 relative">
                        <p className="uppercase text-white/70 text-xs sm:text-sm">today's forecast</p>

                        <div className="w-full mx-auto flex mt-4 sm:mt-5 relative">
                            <button className="forecast-swiper-button-prev absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0f1624]/90 border border-white/10 text-white hover:bg-blue-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    nextEl: '.forecast-swiper-button-next',
                                    prevEl: '.forecast-swiper-button-prev',
                                }}
                                spaceBetween={10}
                                breakpoints={{
                                    320: { slidesPerView: 2 },
                                    375: { slidesPerView: 3 },
                                    480: { slidesPerView: 3 },
                                    640: { slidesPerView: 4 },
                                    768: { slidesPerView: 4 },
                                    1024: { slidesPerView: 5 },
                                    1280: { slidesPerView: 6 },
                                    1536: { slidesPerView: 7 }
                                }}
                                className="w-full px-8 sm:px-10"
                            >
                                {today?.hour?.map((v, index) => {
                                    const date = new Date(v.time_epoch * 1000);
                                    const time = date.toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true
                                    });

                                    console.log(date, time, v);
                                    let image;
                                    let classname;

                                    const condition = v?.condition?.text || "";
                                    const icon = v?.condition?.icon || "";
                                    const isDay = v?.is_day !== undefined ? v.is_day === 1 : !icon.toLowerCase().includes('/night/');
                                    ({ image, classname } = getWeatherImage(condition, icon, isDay));

                                    return (<SwiperSlide key={index} className="relative flex items-center justify-center">
                                        <div className="relative flex items-center justify-center w-full
                                                    after:hidden sm:after:block after:absolute after:right-0 after:top-1/2
                                                    after:h-[80px] md:after:h-[110px] after:w-px
                                                    after:-translate-y-1/2 after:bg-[#f5f5f53a]">
                                            <div className="w-fit p-1 sm:p-2 text-center">
                                                <p className="font-bold text-xs sm:text-sm">{time ?? "6:00 AM"}</p>

                                                <img
                                                    src={image}
                                                    className={`${classname} mx-auto mt-1 sm:mt-2`}
                                                />

                                                <h3 className="relative w-fit text-lg sm:text-xl md:text-2xl font-bold mx-auto mt-1 sm:mt-2">
                                                    {Math.round(variant?.temp === 'Celsius' ? v?.temp_c : v?.temp_f)}
                                                    <RxDot className="absolute -right-4 sm:-right-5 top-0 text-md stroke-[0.5]" />
                                                </h3>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                    )
                                })}
                            </Swiper>

                            <button className="forecast-swiper-button-next absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0f1624]/90 border border-white/10 text-white hover:bg-blue-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="px-4 sm:px-6 md:px-7 py-4 sm:py-5 bg-[#202B3B] rounded-2xl mt-4 sm:mt-5">
                        <div className="flex  justify-between items-start sm:items-center gap-3 sm:gap-0">
                            <p className="uppercase text-white/70 text-xs sm:text-sm">air condition</p>
                            <button onClick={() => setShowMore(true)} className="rounded-2xl bg-blue-500 px-4 sm:px-5 py-1 text-sm sm:text-md font-bold">see more</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 sm:mt-5 gap-y-4 sm:gap-y-7 gap-x-4">

                            <div className="flex gap-3 items-start">
                                <FaTemperatureFull className="air-icone" />
                                <div className="text-air">
                                    <p className="airtext-top">Real Feel</p>

                                    <h4 className="relative w-fit text-[24px] sm:text-[30px] font-bold text-white/70 -mt-1">
                                        {current?.feelslike_c}
                                        <RxDot className="absolute -right-5 sm:-right-6 top-0 text-md stroke-[0.5]" />
                                    </h4>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <FaWind className="air-icone" />
                                <div className="text-air">
                                    <p className="airtext-top">Wind</p>
                                    <h4 className="relative w-fit text-[24px] sm:text-[30px] font-bold text-white/70 -mt-1">
                                        {/* { Math.round(windspeed)  + variant?.windspeed} */}
                                        {Math.round(windspeed * 100) / 100 + variant?.windspeed}
                                    </h4>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <IoWater className="air-icone" />
                                <div className="text-air">
                                    <p className="airtext-top">Precipitation</p>

                                    <h4 className="relative w-fit text-[24px] sm:text-[30px] font-bold text-white/70 -mt-1">
                                        {precip.value + precip.label}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <FaSun className="air-icone" />
                                <div className="text-air">
                                    <p className="airtext-top">UV Index</p>

                                    <h4 className="relative w-fit text-[24px] sm:text-[30px] font-bold text-white/70 -mt-1">
                                        {current?.uv}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>

                    {showMore && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                            <div className="w-full max-w-lg bg-[#202B3B] rounded-2xl p-5 sm:p-6 text-white relative">
                                <button onClick={() => setShowMore(false)} className="absolute top-3 right-4 text-white/70 hover:text-white text-xl">&times;</button>
                                <p className="uppercase text-white/70 text-xs sm:text-sm m b-4">air condition details</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
                                    <div className="flex gap-3">
                                        <FaTemperatureFull className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Real Feel</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{current?.feelslike_c}<RxDot className="absolute -right-5 top-0 text-md stroke-[0.5]" /></h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <FaWind className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Wind</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{Math.round(windspeed * 100) / 100 + variant?.windspeed}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <IoWater className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Precipitation</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{precip.value + precip.label}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <FaSun className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">UV Index</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{current?.uv}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <BiDroplet className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Humidity</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{current?.humidity + '%'}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <MdVisibility className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Visibility</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{vis.value + vis.label}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <PiGaugeFill className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Pressure</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{Math.round(pressure * 100) / 100 + variant?.pressurre}</h4>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <FaCloudSun className="air-icone" />
                                        <div className="text-air">
                                            <p className="airtext-top">Sun Set</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">{today?.astro?.sunset}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-[40%] xl:w-[35%] 2xl:w-[30%]">
                    <div className="px-4 sm:px-6 md:px-7 py-6 sm:py-9 bg-[#202B3B] rounded-2xl mt-4 lg:mt-6 sm:mt-10">
                        <p className="uppercase text-white/70 text-xs sm:text-sm">7-days forecast</p>
                        <div className="mt-4">
                            {forecast?.map((v, index) => {
                                let image;
                                let classname = "weather-icone";
                                const condition = v?.day?.condition?.text || "";
                                const icon = v?.day?.condition?.icon || "";
                                ({ image, classname } = getWeatherImage(condition, icon, true));

                                const date = new Date(v.date + "T12:00:00");
                                const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });

                                console.log("today", v)

                                return (
                                    <div
                                        key={v.date}
                                        className={`grid grid-cols-12 items-center text-white/70 py-4 ${index !== forecast.length - 1
                                            ? "border-b border-white/30"
                                            : ""
                                            }`}
                                    >
                                        <h4 className="col-span-3 sm:col-span-4 text-sm sm:text-base">
                                            {dayName}
                                        </h4>

                                        <div className="col-span-5 sm:col-span-4 flex gap-1 items-center">
                                            <img
                                                src={image}
                                                alt={v?.day?.condition?.text || "Weather"}
                                                className={classname}
                                            />

                                            <p className="forcastname text-xs sm:text-sm">
                                                {v?.day?.condition?.text || "Unknown"}
                                            </p>
                                        </div>

                                        <div className="col-span-4 text-right sm:col-start-10">
                                            <span className="forcastname">
                                                {Math.round(variant?.temp === 'Celsius' ? v?.day?.mintemp_c : v?.day?.mintemp_f)}°
                                            </span>
                                            {" / "}
                                            {Math.round(variant?.temp === 'Celsius' ? v?.day?.maxtemp_c : v?.day?.maxtemp_f)}°
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </>)
                : null}
        </div>
    )
}

export default Weather;                                                                                                                                                    