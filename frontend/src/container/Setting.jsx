import React, { useState } from "react";
import { useEffect } from "react";
import { subscribeToPush } from "../utils/push";

function Setting({ onchangevarint,variant }) {

    const [temp, setTemp] = useState(variant.temp);
    const [windspeed, setWindspeed] = useState(variant.windspeed);
    const [pressurre, setPressure] = useState(variant.pressurre);
    const [precipitation, setPrecipitation] = useState(variant.precipitation)
    const [distance, setDistance] = useState(variant.distance)
    const [notifStatus, setNotifStatus] = useState('');
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        onchangevarint({temp,windspeed,pressurre,precipitation,distance})
    },[temp,windspeed,pressurre,precipitation,distance])

    const handleEnableNotifications = async () => {
        setLoading(true);
        setNotifStatus('');
        try {
            const res = await subscribeToPush();
            setNotifStatus(res.message || 'Notifications enabled successfully');
        } catch (error) {
            setNotifStatus(error.message || 'Failed to enable notifications');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>

            <h2 className="text-[30px] sm:text-[32px] font-bold text-white min-[992px]:hidden">Settings</h2>

            <section className="flex py-6">
                <div id="setting" className="w-full 2xl:w-[70%] ">
                    <h2 className="text-[22px] min-[992px]:text-[32px] font-bold text-white">Units</h2>

                    <div className="bg-[#202B3B] px-4 py-6 rounded-2xl mt-3 min-[992px]:mt-5 lg:ml-6">
                        <div>
                            <h2 className="text-[16px] sm:text-[17px] font-bold text-white/70 uppercase">temperature</h2>

                            <ul className="grid grid-cols-12">
                                <li
                                    onClick={() => setTemp('Celsius')}
                                    className={`col-span-6  ${variant.temp === 'Celsius' ? "bg-[#35455E] text-white" : ""}`}>
                                    Celsius
                                </li>
                                <li
                                    onClick={() => setTemp('Fahrenhit')}
                                    className={`col-span-6  ${variant.temp === 'Fahrenhit' ? "bg-[#35455E] text-white" : ""}`}>
                                    Fahrenhit
                                </li>
                            </ul>
                        </div>

                        <div className="my-8">
                            <h2 className="text-[16px] sm:text-[17px] font-bold text-white/70 uppercase">wind speed</h2>

                            <ul className="grid grid-cols-12">
                                <li
                                    onClick={() => setWindspeed('km/h')}
                                    className={`col-span-4 ${variant.windspeed === 'km/h' && "bg-[#35455E] text-white"} `}>
                                    km/h
                                </li>
                                <li
                                    onClick={() => setWindspeed('m/s')}
                                    className={`col-span-4 ${variant.windspeed === 'm/s' && "bg-[#35455E] text-white"}`}>
                                    m/s
                                </li>
                                <li
                                    onClick={() => setWindspeed('knots')}
                                    className={`col-span-4 ${variant.windspeed === 'knots' && "bg-[#35455E] text-white"}`}>
                                    knots
                                </li>
                            </ul>
                        </div>

                        <div className="my-8">
                            <h2 className="text-[16px] sm:text-[17px] font-bold text-white/70 uppercase">pressure</h2>

                            <ul className="grid grid-cols-12">
                                <li
                                    onClick={() => setPressure('hPa')}
                                    className={`col-span-3 ${variant.pressurre === 'hPa' && "bg-[#35455E] text-white"}`}>
                                    hPa
                                </li>
                                <li
                                    onClick={() => setPressure('Inches')}
                                    className={`col-span-3 ${variant.pressurre === 'Inches' && 'bg-[#35455E] text-white'}`}>
                                    Inches
                                </li>
                                <li
                                    onClick={() => setPressure('kPa')}
                                    className={`col-span-3 ${variant.pressurre === 'kPa' && 'bg-[#35455E] text-white'}`}>
                                    kPa
                                </li>
                                <li
                                    onClick={() => setPressure('mm')}
                                    className={`col-span-3 ${variant.pressurre === 'mm' && 'bg-[#35455E] text-white'}`}>
                                    mm
                                </li>
                            </ul>
                        </div>

                        <div className="my-8">
                            <h2 className="text-[16px] sm:text-[17px] font-bold text-white/70 uppercase">precipitation</h2>

                            <ul className="grid grid-cols-12">
                                <li
                                    onClick={() => setPrecipitation('Millimeters')}
                                    className={`col-span-6 ${variant.precipitation === "Millimeters" && "bg-[#35455E] text-white"}`}>
                                    Millimeters
                                </li>
                                <li
                                    onClick={() => setPrecipitation('Inches')}
                                    className={`col-span-6 ${variant.precipitation === 'Inches' && "bg-[#35455E] text-white"}`}>
                                    Inches
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-[16px] sm:text-[17px] font-bold text-white/70 uppercase">distance</h2>

                            <ul className="grid grid-cols-12">
                                <li
                                    onClick={() => setDistance('Kilomiters')}
                                    className={`col-span-6 ${variant.distance === 'Kilomiters' && 'bg-[#35455E] text-white'}`}>
                                    Kilomiters
                                </li>
                                <li
                                    onClick={() => setDistance('miles')}
                                    className={`col-span-6 ${variant.distance === 'miles' && 'bg-[#35455E] text-white'}`}>
                                    miles
                                </li>
                            </ul>
                        </div>

                    </div>

                    <h2 className="text-[22px] min-[992px]:text-[32px] font-bold text-white mt-8">Notifications</h2>
                    <div className="bg-[#202B3B] px-4 py-6 rounded-2xl mt-3 min-[992px]:mt-5 lg:ml-6">
                        <p className="text-white/70 text-sm mb-4">Get alerts for rain, floods, cyclones and important weather updates.</p>
                        <button
                            onClick={handleEnableNotifications}
                            disabled={loading}
                            className="px-4 py-2 bg-[#4C9BFF] text-white rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Enabling...' : 'Enable Push Notifications'}
                        </button>
                        {notifStatus && <p className="text-white/80 text-sm mt-3">{notifStatus}</p>}
                    </div>
                </div>

            </section>
        </main>
    );
}

export default Setting;
