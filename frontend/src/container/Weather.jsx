import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

    const [coords, setCoords] = useState(null);
    const [showMore, setShowMore] = useState(false);
    const [windspeed, setWindspeed] = useState('');
    const [pressure, setPressure] = useState('');
    const dispatch = useDispatch();
    const weatherdata = useSelector(state => state.weather);

    const current  = weatherdata?.data?.current;
    const forecast = weatherdata?.data?.forecast?.forecastday;
    const today    = forecast?.[0];

    function windconvertor(selectwind, value_kmh) {
        switch (selectwind) {
            case 'km/h':   return value_kmh;
            case 'm/s':    return value_kmh / 3.6;
            case 'knots':  return value_kmh / 1.852;
            default:       return value_kmh;
        }
    }

    function pressureConvetor(selectpre, value_in) {
        switch (selectpre) {
            case 'Inches': return value_in;
            case 'mm':     return value_in * 25.4;
            case 'kPa':    return value_in * 3.38639;
            case 'hPa':    return value_in * 33.86389;
            default:       return value_in;
        }
    }

    function precipConverter(unit, mm, inches) {
        if (unit === 'Inches') return { value: (inches ?? 0).toFixed(2), label: 'in' };
        return { value: (mm ?? 0).toFixed(1), label: 'mm' };
    }

    function visConverter(unit, km, miles) {
        if (unit === 'miles') return { value: (miles ?? 0).toFixed(1), label: 'mi' };
        return { value: (km ?? 0).toFixed(1), label: 'km' };
    }

    useEffect(() => {
        if (!current) return;
        try {
            setWindspeed(windconvertor(variant?.windspeed, current?.wind_kph));
            setPressure(pressureConvetor(variant?.pressurre, today?.hour?.[0]?.pressure_in));
        } catch (e) {}
    }, [current, today, variant?.windspeed, variant?.pressurre]);

    const precip = precipConverter(variant?.precipitation, current?.precip_mm, current?.precip_in);
    const vis    = visConverter(variant?.distance, current?.vis_km, current?.vis_miles);

    useEffect(() => {
        if (search && search.trim()) {
            dispatch(getWeather(search));
            return;
        }
        if (coords) {
            dispatch(getWeather(`${coords.latitude},${coords.longitude}`));
        }
    }, [search, coords, dispatch]);

    const fetchIpLocation = async () => {
        if (search && search.trim()) return;
        try {
            const res  = await fetch("https://ipwho.is/");
            const data = await res.json();
            if (data.success && data.latitude && data.longitude) {
                setCoords(prev => prev ? prev : { latitude: data.latitude, longitude: data.longitude });
            }
        } catch (e) {}
    };

    const requestGpsLocation = () => {
        if (search && search.trim()) return;
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            () => {},
            { enableHighAccuracy: false, timeout: 10000 }
        );
    };

    useEffect(() => {
        if (!search || !search.trim()) {
            fetchIpLocation();
            requestGpsLocation();
        }
    }, []);

    // ── Framer Motion variants ──────────────────────────────────────────────
    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };
    const slideLeft = {
        hidden: { opacity: 0, x: -40 },
        show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } }
    };
    const slideRight = {
        hidden: { opacity: 0, x: 50 },
        show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } }
    };
    const scaleIn = {
        hidden: { opacity: 0, scale: 0.65 },
        show:   { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring', stiffness: 130 } }
    };
    const stagger = {
        hidden: {},
        show:   { transition: { staggerChildren: 0.09 } }
    };
    // ────────────────────────────────────────────────────────────────────────

    const cityKey       = weatherdata?.data?.location?.name || 'default';
    const condText      = current?.condition?.text || '';
    const condIcon      = current?.condition?.icon || '';
    const isCurrentDay  = current?.is_day !== undefined ? current.is_day === 1 : true;
    const { image: heroImage } = getWeatherImage(condText, condIcon, isCurrentDay);

    const airStats = [
        { icon: <FaTemperatureFull className="air-icone" />, label: 'Real Feel',     value: current?.feelslike_c, dot: true },
        { icon: <FaWind className="air-icone" />,            label: 'Wind',          value: Math.round((windspeed ?? 0) * 100) / 100 + (variant?.windspeed || '') },
        { icon: <IoWater className="air-icone" />,           label: 'Precipitation', value: precip.value + precip.label },
        { icon: <FaSun className="air-icone" />,             label: 'UV Index',      value: current?.uv },
    ];

    const modalStats = [
        { icon: <FaTemperatureFull className="air-icone" />, label: 'Real Feel',     value: current?.feelslike_c, dot: true },
        { icon: <FaWind className="air-icone" />,            label: 'Wind',          value: Math.round((windspeed ?? 0) * 100) / 100 + (variant?.windspeed || '') },
        { icon: <IoWater className="air-icone" />,           label: 'Precipitation', value: precip.value + precip.label },
        { icon: <FaSun className="air-icone" />,             label: 'UV Index',      value: current?.uv },
        { icon: <BiDroplet className="air-icone" />,         label: 'Humidity',      value: (current?.humidity ?? '--') + '%' },
        { icon: <MdVisibility className="air-icone" />,      label: 'Visibility',    value: vis.value + vis.label },
        { icon: <PiGaugeFill className="air-icone" />,       label: 'Pressure',      value: Math.round((pressure ?? 0) * 100) / 100 + (variant?.pressurre || '') },
        { icon: <FaCloudSun className="air-icone" />,        label: 'Sunrise',       value: today?.astro?.sunrise },
        { icon: <FaCloudSun className="air-icone" />,        label: 'Sunset',        value: today?.astro?.sunset },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 2xl:gap-7 w-full">
            {weatherdata?.data?.current ? (
                <>
                    {/* ── LEFT COLUMN ── */}
                    <motion.div
                        key={cityKey}
                        className="w-full lg:w-[60%] xl:w-[65%] 2xl:w-[70%] text-white"
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                    >
                        {/* Hero */}
                        <motion.div
                            className="flex flex-col sm:flex-row sm:justify-between items-center w-full sm:w-[80%] md:w-[85%] 2xl:w-[70%] mx-auto mt-6 sm:mt-10 gap-6 sm:gap-0"
                        >
                            {/* City name + temp */}
                            <motion.div
                                className="py-2 px-4 sm:px-6 md:px-10 text-center sm:text-left"
                                variants={slideLeft}
                            >
                                <h2 className="text-[28px] sm:text-[34px] font-bold">
                                    {weatherdata?.data?.location?.name}
                                </h2>
                                <p className="text-white/70 mt-1">
                                    Chance of rain: {current?.chance_of_rain ?? '--'}%
                                </p>
                                <div className="items-start mt-6 sm:mt-12 hidden sm:flex">
                                    <motion.h1
                                        key={variant?.temp + cityKey}
                                        className="text-4xl sm:text-5xl 2xl:text-6xl font-bold"
                                        initial={{ opacity: 0, scale: 0.4 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                                    >
                                        {Math.round(variant?.temp === 'Celsius' ? current?.temp_c : current?.temp_f)}
                                    </motion.h1>
                                    <span className="ml-1 text-xl sm:text-2xl font-semibold">
                                        °{variant?.temp === 'Celsius' ? 'C' : 'F'}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Floating weather icon */}
                            <motion.div
                                variants={scaleIn}
                                animate={{
                                    y:      [0, -14, 0],
                                    rotate: [0, 4, -4, 0],
                                }}
                                transition={{
                                    y:      { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                                    rotate: { duration: 6,   repeat: Infinity, ease: 'easeInOut' },
                                    opacity: { duration: 0.6 },
                                    scale:   { duration: 0.6, type: 'spring' },
                                }}
                            >
                                <img
                                    src={heroImage}
                                    className="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] 2xl:w-[200px] 2xl:h-[200px]"
                                    alt={condText}
                                />
                            </motion.div>

                            {/* Mobile temp */}
                            <motion.div className="flex items-start sm:hidden" variants={fadeUp}>
                                <h1 className="text-4xl font-bold">
                                    {Math.round(variant?.temp === 'Celsius' ? current?.temp_c : current?.temp_f)}
                                </h1>
                                <span className="ml-1 text-xl font-semibold mt-1">
                                    °{variant?.temp === 'Celsius' ? 'C' : 'F'}
                                </span>
                            </motion.div>
                        </motion.div>

                        {/* Today's forecast swiper */}
                        <motion.div
                            className="px-4 sm:px-6 md:px-7 py-6 sm:py-8 bg-[#202B3B] rounded-2xl mt-6 sm:mt-10 relative"
                            variants={fadeUp}
                        >
                            <p className="uppercase text-white/70 text-xs sm:text-sm">today's forecast</p>
                            <div className="w-full mx-auto flex mt-4 sm:mt-5 relative">
                                <button className="forecast-swiper-button-prev absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0f1624]/90 border border-white/10 text-white hover:bg-blue-500 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <Swiper
                                    modules={[Navigation]}
                                    navigation={{ nextEl: '.forecast-swiper-button-next', prevEl: '.forecast-swiper-button-prev' }}
                                    spaceBetween={10}
                                    breakpoints={{
                                        320: { slidesPerView: 2 }, 375: { slidesPerView: 3 },
                                        480: { slidesPerView: 3 }, 640: { slidesPerView: 4 },
                                        768: { slidesPerView: 4 }, 1024: { slidesPerView: 5 },
                                        1280: { slidesPerView: 6 }, 1536: { slidesPerView: 7 }
                                    }}
                                    className="w-full px-8 sm:px-10"
                                >
                                    {today?.hour?.map((v, index) => {
                                        const date = new Date(v.time_epoch * 1000);
                                        const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                                        const cond   = v?.condition?.text || "";
                                        const icon   = v?.condition?.icon || "";
                                        const dayHr  = v?.is_day !== undefined ? v.is_day === 1 : !icon.toLowerCase().includes('/night/');
                                        const { image, classname } = getWeatherImage(cond, icon, dayHr);

                                        return (
                                            <SwiperSlide key={index} className="relative flex items-center justify-center">
                                                <motion.div
                                                    className="relative flex items-center justify-center w-full after:hidden sm:after:block after:absolute after:right-0 after:top-1/2 after:h-[80px] md:after:h-[110px] after:w-px after:-translate-y-1/2 after:bg-[#f5f5f53a]"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.025, duration: 0.35 }}
                                                    whileHover={{ scale: 1.1, transition: { duration: 0.18 } }}
                                                >
                                                    <div className="w-fit p-1 sm:p-2 text-center">
                                                        <p className="font-bold text-xs sm:text-sm">{time}</p>
                                                        <img src={image} className={`${classname} mx-auto mt-1 sm:mt-2`} alt={cond} />
                                                        <h3 className="relative w-fit text-lg sm:text-xl md:text-2xl font-bold mx-auto mt-1 sm:mt-2">
                                                            {Math.round(variant?.temp === 'Celsius' ? v?.temp_c : v?.temp_f)}
                                                            <RxDot className="absolute -right-4 sm:-right-5 top-0 text-md stroke-[0.5]" />
                                                        </h3>
                                                    </div>
                                                </motion.div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                                <button className="forecast-swiper-button-next absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0f1624]/90 border border-white/10 text-white hover:bg-blue-500 transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>

                        {/* Air condition card */}
                        <motion.div
                            className="px-4 sm:px-6 md:px-7 py-4 sm:py-5 bg-[#202B3B] rounded-2xl mt-4 sm:mt-5"
                            variants={fadeUp}
                        >
                            <div className="flex justify-between items-start sm:items-center gap-3 sm:gap-0">
                                <p className="uppercase text-white/70 text-xs sm:text-sm">air condition</p>
                                <motion.button
                                    onClick={() => setShowMore(true)}
                                    className="rounded-2xl bg-blue-500 px-4 sm:px-5 py-1 text-sm sm:text-md font-bold"
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.94 }}
                                >
                                    see more
                                </motion.button>
                            </div>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 mt-4 sm:mt-5 gap-y-4 sm:gap-y-7 gap-x-4"
                                variants={stagger}
                                initial="hidden"
                                animate="show"
                            >
                                {airStats.map(({ icon, label, value, dot }) => (
                                    <motion.div key={label} className="flex gap-3 items-start" variants={fadeUp}>
                                        {icon}
                                        <div className="text-air">
                                            <p className="airtext-top">{label}</p>
                                            <h4 className="relative w-fit text-[24px] sm:text-[30px] font-bold text-white/70 -mt-1">
                                                {value}
                                                {dot && <RxDot className="absolute -right-5 sm:-right-6 top-0 text-md stroke-[0.5]" />}
                                            </h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* See More modal with AnimatePresence */}
                        <AnimatePresence>
                            {showMore && (
                                <motion.div
                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowMore(false)}
                                >
                                    <motion.div
                                        className="w-full max-w-lg bg-[#202B3B] rounded-2xl p-5 sm:p-6 text-white relative"
                                        initial={{ scale: 0.75, opacity: 0, y: 50 }}
                                        animate={{ scale: 1,    opacity: 1, y: 0 }}
                                        exit={{    scale: 0.75, opacity: 0, y: 50 }}
                                        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <motion.button
                                            onClick={() => setShowMore(false)}
                                            className="absolute top-3 right-4 text-white/70 hover:text-white text-xl"
                                            whileHover={{ rotate: 90 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            &times;
                                        </motion.button>
                                        <p className="uppercase text-white/70 text-xs sm:text-sm mb-4">air condition details</p>
                                        <motion.div
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4"
                                            variants={stagger}
                                            initial="hidden"
                                            animate="show"
                                        >
                                            {modalStats.map(({ icon, label, value, dot }) => (
                                                <motion.div key={label} className="flex gap-3" variants={fadeUp}>
                                                    {icon}
                                                    <div className="text-air">
                                                        <p className="airtext-top">{label}</p>
                                                        <h4 className="relative w-fit text-[24px] sm:text-[28px] font-bold text-white -mt-1">
                                                            {value}
                                                            {dot && <RxDot className="absolute -right-5 top-0 text-md stroke-[0.5]" />}
                                                        </h4>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* ── RIGHT COLUMN — 7-day forecast ── */}
                    <motion.div
                        key={'fc-' + cityKey}
                        className="w-full lg:w-[40%] xl:w-[35%] 2xl:w-[30%]"
                        variants={slideRight}
                        initial="hidden"
                        animate="show"
                    >
                        <div className="px-4 sm:px-6 md:px-7 py-6 sm:py-9 bg-[#202B3B] rounded-2xl mt-4 lg:mt-6 sm:mt-10">
                            <p className="uppercase text-white/70 text-xs sm:text-sm">7-days forecast</p>
                            <div className="mt-4">
                                {forecast?.map((v, index) => {
                                    const cond = v?.day?.condition?.text || "";
                                    const icon = v?.day?.condition?.icon || "";
                                    const { image, classname } = getWeatherImage(cond, icon, true);
                                    const date    = new Date(v.date + "T12:00:00");
                                    const dayName = index === 0 ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" });

                                    return (
                                        <motion.div
                                            key={v.date}
                                            className={`grid grid-cols-12 items-center text-white/70 py-4 ${index !== forecast.length - 1 ? "border-b border-white/30" : ""}`}
                                            initial={{ opacity: 0, x: 35 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
                                            whileHover={{ x: 4, transition: { duration: 0.15 } }}
                                        >
                                            <h4 className="col-span-3 sm:col-span-4 text-sm sm:text-base">{dayName}</h4>
                                            <div className="col-span-5 sm:col-span-4 flex gap-1 items-center">
                                                <motion.img
                                                    src={image}
                                                    alt={cond}
                                                    className={classname}
                                                    whileHover={{ rotate: 12, scale: 1.2 }}
                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                />
                                                <p className="forcastname text-xs sm:text-sm">{cond || "Unknown"}</p>
                                            </div>
                                            <div className="col-span-4 text-right sm:col-start-10">
                                                <span className="text-white/40">
                                                    {Math.round(variant?.temp === 'Celsius' ? v?.day?.mintemp_c : v?.day?.mintemp_f)}°
                                                </span>
                                                {" / "}
                                                <span className="text-white font-semibold">
                                                    {Math.round(variant?.temp === 'Celsius' ? v?.day?.maxtemp_c : v?.day?.maxtemp_f)}°
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </>
            ) : null}
        </div>
    );
}

export default Weather;
