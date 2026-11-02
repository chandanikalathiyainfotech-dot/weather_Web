import React from "react";
import { RxDot } from "react-icons/rx";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getmultiplectyWeather, getWeather } from "../redux/slice/weather.slice";
import { useState } from "react";

function CurrentCity({ search, onCangeCity, variant, setSearchvalue, changeselectedvalue, selcity }) {

    const [selectCity, setSelectCity] = useState('');
    const [city, setCity] = useState('')
    const [citysarray, setCitysArray] = useState([])
    const dispatch = useDispatch()
    const weatherdata = useSelector(state => state.weather.data)
    const cityweather = useSelector(state => state.weather.citiesweather)
    const location = weatherdata?.location;
    const current = weatherdata?.current;
    const forecast = weatherdata?.forecast?.forecastday;
    const today = forecast?.[0];
    console.log("weatherdata", weatherdata, current)
    console.log("selectcity", selcity, search, selectCity)


    useEffect(() => {
        const citys = JSON.parse(localStorage.getItem('city') || '[]');

        setCity(search);

        setCitysArray(citys);

        if (search && search.trim() !== '') {
            const formatted = search.trim().charAt(0).toUpperCase() + search.trim().slice(1);
            setSelectCity(formatted);
        } else if (citys?.length > 0) {
            const firstCity = citys[0].charAt(0).toUpperCase() + citys[0].slice(1);
            setSelectCity(firstCity);
        } else {
            setSelectCity('');
        }
    }, [search]);

    useEffect(() => {
        if (selectCity) {
            console.log("Selected City:", selectCity);

            setSearchvalue(selectCity);
            changeselectedvalue(selectCity);
        }
    }, [selectCity]);

    console.log("citysarray", citysarray)

    useEffect(() => {
        dispatch(getWeather(selectCity))

        // setSelectCity(selcity)
    }, [])

    useEffect(() => {
        console.log("selectedcity", selectCity)
        dispatch(getmultiplectyWeather(citysarray))
        if (selcity && selcity.trim() !== '') {
            setSelectCity(selcity)
        }
    }, [citysarray])
    
    useEffect(() => {
        if (search && search.trim() !== '') {
            console.log("selectcity", "ok")
            const formatted = search.trim().charAt(0).toUpperCase() + search.trim().slice(1);
            setSelectCity(formatted);
            setSearchvalue(formatted);
            changeselectedvalue(formatted);
            dispatch(getWeather(search.trim()))
        } else if (selectCity) {
            console.log("selectcity", "ok")
            setCity('')
            dispatch(getWeather(selectCity))
        }
        //   changeselectedvalue(selectCity || citysarray?.[0]?.charAt(0).toUpperCase() + citysarray?.[0]?.slice(1))
    }, [search, selectCity])

    const cities = [
        {
            city: 'Madrid',
            temp: '31',
            time: '10:23',
            img: '../../public/image/sun.png'
        },
        {
            city: 'Vienna',
            temp: '27',
            time: '11:23',
            img: '../../public/image/raincloud.webp'
        },
        {
            city: 'Athens',
            temp: '33',
            time: '12:23',
            img: '../../public/image/lighcloud.png'
        },
    ]

    const todayforcast = [
        {
            time: '6:00 AM',
            temprature: '25',
            image: '../../public/image/cloud.webp',
            classname: 'weather-icone'
        },
        {
            time: '9:00 AM',
            temprature: '28',
            image: '../../public/image/cloudsun.png',
            classname: 'suncloud-icone'
        },
        {
            time: '12:00 PM',
            temprature: '28',
            image: '../../public/image/sun.png',
            classname: 'weather-icone'
        },
        {
            time: '3:00 PM',
            temprature: '34',
            image: '../../public/image/sun.png',
            classname: 'weather-icone'
        },
        {
            time: '6:00 PM',
            temprature: '32',
            image: '../../public/image/sun.png',
            classname: 'weather-icone'
        },
        {
            time: '9:00 PM',
            temprature: '30',
            image: '../../public/image/cloudsun.png',
            classname: 'suncloud-icone'
        },
        {
            time: '12:00 AM',
            temprature: '22',
            image: '../../public/image/cloud.webp',
            classname: 'weather-icone'
        },
        {
            time: '6:00 AM',
            temprature: '25',
            image: '../../public/image/cloud.webp',
            classname: 'weather-icone'
        },
    ]

    function setvaluefun(city) {
        setSelectCity(city);
        setSearchvalue(city);
        changeselectedvalue(city);
        onCangeCity('');
    }

    return (
        <main>
            <div className="flex flex-col lg:flex-row gap-4 xl:gap-6 2xl:gap-10 w-full">
                <div className="w-full lg:w-[60%] xl:w-[65%] 2xl:w-[70%] text-white">
                    {cityweather?.map((v, i) => {

                        let image;
                        let classname;

                        const condition = v?.condition?.toLowerCase() || "";
                        console.log("condition", condition)

                        if (condition.includes("/night/")) {
                            if (condition.includes("clear")) {
                                image = "/image/cloudmoon.webp";
                            } else {
                                image = "/image/cloud.webp";
                            }
                            classname = "weather-icone";
                        } else if (
                            v?.temp_c >= 30 &&
                            (condition.includes("sunny") || condition.includes("clear"))
                        ) {
                            image = "/image/sun.png";
                            classname = "weather-icone";
                        } else if (condition.includes("rain")) {
                            image = "/image/raincloud.webp";
                            classname = "weather-icone";
                        } else if (condition.includes("partly cloudy")) {
                            image = "/image/cloudsun.png";
                            classname = "suncloud-icone";
                        } else if (condition.includes("sunny") || condition.includes("clear")) {
                            image = "/image/sun.png";
                            classname = "weather-icone";
                        } else if (
                            condition.includes("cloud") ||
                            condition.includes("haze") ||
                            condition.includes("smoky") ||
                            condition.includes("mist") ||
                            condition.includes("fog")
                        ) {
                            image = "/image/cloud.webp";
                            classname = "weather-icone";
                        } else if (condition.includes("overcast")) {
                            image = "/image/cloud.webp";
                            classname = "weather-icone";
                        }

                        console.log("selectcity", selectCity === v.city, selectCity, selcity)

                        return (
                            <div
                                key={v.city}
                                className={`flex pl-5 pr-8 py-3 rounded-2xl items-center justify-between mt-4 ${selectCity?.toLowerCase() === v.city?.toLowerCase()
                                    ? 'bg-transparent border-[#0461A5] border-2'
                                    : 'bg-[#202B3B]'
                                    }`}
                                onClick={() => setvaluefun(v.city)}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={image}
                                        className={`${classname} mx-auto mt-1 sm:mt-2`}
                                    />
                                    <div>
                                        <h3 className="text-2xl font-bold">{v.city}</h3>
                                        <p className="text-white/70 text-lg">{v.time}</p>
                                    </div>
                                </div>
                                {/* 
                            <h3 className="relative w-fit text-4xl font-bold text-white/70">
                                {v.temp}
                                <RxDot className="absolute -right-6 -top-1 text-md stroke-[0.5]" />
                            </h3> */}
                                <div className="flex items-start text-white/70">
                                    <h3 className="w-fit text-4xl font-bold ">
                                        {Math.round(variant?.temp === 'Celsius' ? v?.temperaturec : v?.temperaturef)}
                                    </h3>
                                    <span className="ml-1 text-xl sm:text-2xl font-semibold">°{variant?.temp === 'Celsius' ? 'C' : 'F'}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="w-full lg:w-[40%] xl:w-[35%] 2xl:w-[25%] text-white">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-center w-full gap-6 sm:gap-0 border-b-1 px-4 pb-8">
                        <div className="py-2 text-center sm:text-left">
                            <h2 className="text-[28px] sm:text-[34px] font-bold">{location?.name}</h2>
                            <p className="text-white/70 mt-1">Chance of rain:  {current?.chance_of_rain + '%'} </p>

                            <div className="items-start mt-6 sm:mt-12 hidden sm:flex">
                                <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-bold hidden sm:block">
                                    {Math.round(variant?.temp === 'Celsius' ? current?.temp_c : current?.temp_f)}
                                </h1>
                                <span className="ml-1 text-xl sm:text-2xl font-semibold">°{variant?.temp === 'Celsius' ? 'C' : 'F'}</span>
                            </div>
                        </div>

                        <div>
                            <img src='../../public/image/sun.png' className="w-[120px] h-[120px] " />
                        </div>

                        <div className="flex items-start mt-6 sm:mt-12 flex sm:hidden ">
                            <h1 className="text-4xl sm:text-5xl 2xl:text-6xl font-bold hidden sm:block">
                                {Math.round(variant?.temp === 'Celsius' ? current?.temp_c : current?.temp_f)}
                            </h1>
                            <span className="ml-1 text-xl sm:text-2xl font-semibold">°{variant?.temp === 'Celsius' ? 'C' : 'F'}</span>
                        </div>
                    </div>

                    {/* forecast */}
                    <div className="py-12 border-b-1 relative">
                        <p className="uppercase text-white/70 text-xs sm:text-sm">today's forecast</p>

                        <div className="w-full mx-auto flex mt-4 sm:mt-5 relative">

                            <button className="forecast-swiper-button-prev absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0f1624]/90 border border-white/10 text-white hover:bg-blue-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>

                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={10}
                                navigation={{
                                    nextEl: '.forecast-swiper-button-next',
                                    prevEl: '.forecast-swiper-button-prev',
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 2 },
                                    375: { slidesPerView: 3 },
                                    480: { slidesPerView: 3 },
                                    640: { slidesPerView: 3 },
                                    768: { slidesPerView: 3 },
                                    1024: { slidesPerView: 3 },
                                    1280: { slidesPerView: 3 },
                                    1536: { slidesPerView: 3 }
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

                                    const condition = v?.condition?.text?.toLowerCase() || "";
                                    const icon = v?.condition?.icon?.toLowerCase() || "";

                                    if (icon.includes("/night/")) {
                                        if (condition.includes("clear")) {
                                            image = "/image/cloudmoon.webp";
                                        } else {
                                            image = "/image/cloud.webp";
                                        }
                                        classname = "weather-icone";
                                    } else if (
                                        v?.temp_c >= 30 &&
                                        (condition.includes("sunny") || condition.includes("clear"))
                                    ) {
                                        image = "/image/sun.png";
                                        classname = "weather-icone";
                                    } else if (condition.includes("rain")) {
                                        image = "/image/raincloud.webp";
                                        classname = "weather-icone";
                                    } else if (condition.includes("partly cloudy")) {
                                        image = "/image/cloudsun.png";
                                        classname = "suncloud-icone";
                                    } else if (condition.includes("sunny") || condition.includes("clear") || icon.includes("day")) {
                                        image = "/image/sun.png";
                                        classname = "weather-icone";
                                    } else if (
                                        condition.includes("cloud") ||
                                        condition.includes("haze") ||
                                        condition.includes("smoky") ||
                                        condition.includes("mist") ||
                                        condition.includes("fog")
                                    ) {
                                        image = "/image/cloud.webp";
                                        classname = "weather-icone";
                                    }
                                    console.log(image)

                                    return (
                                        <SwiperSlide key={index} className="relative flex items-center justify-center">
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

                    <div className="pt-8">
                        <p className="uppercase text-white/70 text-xs sm:text-sm">3-days forecast</p>

                        <div className="mt-2">
                            {forecast?.slice(0, 3)?.map((v, index) => {
                                let image;
                                let classname = "weather-icone";

                                const condition =
                                    v?.day?.condition?.text?.toLowerCase() || "";

                                const icon =
                                    v?.day?.condition?.icon?.toLowerCase() || "";

                                // Set weather image according to condition
                                if (icon.includes("/night/")) {
                                    if (condition.includes("clear")) {
                                        image = "/image/cloudmoon.webp";
                                    } else {
                                        image = "/image/cloud.webp";
                                    }
                                    classname = "weather-icone";

                                } else if (
                                    v?.day?.maxtemp_c >= 30 &&
                                    (condition.includes("sunny") ||
                                        condition.includes("clear"))
                                ) {
                                    image = "/image/sun.png";

                                } else if (condition.includes("rain")) {
                                    image = "/image/raincloud.webp";

                                } else if (condition.includes("partly cloudy")) {
                                    image = "/image/cloudsun.png";
                                    classname = "suncloud-icone";

                                } else if (
                                    condition.includes("sunny") ||
                                    condition.includes("clear")
                                ) {
                                    image = "/image/sun.png";

                                } else if (
                                    condition.includes("cloud") ||
                                    condition.includes("haze") ||
                                    condition.includes("smoky") ||
                                    condition.includes("mist") ||
                                    condition.includes("fog")
                                ) {
                                    image = "/image/cloud.webp";
                                } else {
                                    image = "/image/cloud.webp";
                                }

                                // Format date
                                const date = new Date(v.date + "T12:00:00");

                                const dayName =
                                    index === 0
                                        ? "Today"
                                        : date.toLocaleDateString("en-US", {
                                            weekday: "short",
                                        });

                                return (
                                    <div
                                        key={v.date}
                                        className={`grid grid-cols-12 items-center text-white/70 py-3 ${index !== forecast.length - 1
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
                                            {Math.round(variant?.temp === 'Celsius' ? v?.day?.mintemp_c : v?.day?.mintemp_f)}°
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default CurrentCity;

