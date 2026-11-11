import React, { useState } from "react";
import { useEffect } from "react";
import { subscribeToPush, unsubscribeFromPush } from "../utils/push";

function Setting({ onchangevarint,variant }) {

    const [temp, setTemp] = useState(variant.temp);
    const [windspeed, setWindspeed] = useState(variant.windspeed);
    const [pressurre, setPressure] = useState(variant.pressurre);
    const [precipitation, setPrecipitation] = useState(variant.precipitation)
    const [distance, setDistance] = useState(variant.distance)
    const [notifStatus, setNotifStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

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

    // On mount, check if the user already has an active push subscription
    useEffect(() => {
        const checkExistingSubscription = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
            if (Notification.permission !== 'granted') return;
            try {
                const registration = await navigator.serviceWorker.ready;
                const existing = await registration.pushManager.getSubscription();
                if (existing) {
                    setIsSubscribed(true);
                    setNotifStatus({ type: 'success', text: 'You are subscribed to push notifications.' });
                }
            } catch (e) {
                // silently ignore — not subscribed
            }
        };
        checkExistingSubscription();
    }, []);

    const handleEnableNotifications = async () => {
        setLoading(true);
        setNotifStatus('');
        try {
            const res = await subscribeToPush();
            setIsSubscribed(true);
            setNotifStatus({ type: 'success', text: res.message || 'Notifications enabled successfully!' });
        } catch (error) {
            if (error.message === 'PERMISSION_BLOCKED') {
                setNotifStatus({
                    type: 'blocked',
                    text: 'Notifications are blocked. To enable: click the lock icon in your browser\'s address bar → Notifications → Allow, then try again.'
                });
            } else {
                setNotifStatus({ type: 'error', text: error.message || 'Failed to enable notifications' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDisableNotifications = async () => {
        setLoading(true);
        setNotifStatus('');
        try {
            await unsubscribeFromPush();
            setIsSubscribed(false);
            setNotifStatus({ type: 'info', text: 'You have unsubscribed from push notifications.' });
        } catch (error) {
            setNotifStatus({ type: 'error', text: error.message || 'Failed to unsubscribe' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="pb-6">
            <h2 className="text-[26px] sm:text-[30px] font-bold text-white min-[992px]:hidden mb-4">Settings</h2>

            <section className="flex py-2 sm:py-6">
                <div id="setting" className="w-full xl:w-[75%] 2xl:w-[65%]">

                    <h2 className="text-[20px] min-[992px]:text-[28px] font-bold text-white">Units</h2>

                    <div className="bg-[#202B3B] px-3 sm:px-5 py-5 sm:py-6 rounded-2xl mt-3 min-[992px]:mt-5 min-[992px]:ml-6">

                        {/* Temperature */}
                        <div>
                            <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Temperature</h2>
                            <ul className="grid grid-cols-2 gap-2">
                                {['Celsius','Fahrenhit'].map(opt => (
                                    <li key={opt} onClick={() => setTemp(opt)}
                                        className={`text-center py-2 rounded-xl text-sm sm:text-base cursor-pointer transition-colors
                                            ${variant.temp === opt ? 'bg-[#35455E] text-white' : 'text-white/50 hover:text-white'}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Wind Speed */}
                        <div className="mt-6">
                            <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Wind Speed</h2>
                            <ul className="grid grid-cols-3 gap-2">
                                {['km/h','m/s','knots'].map(opt => (
                                    <li key={opt} onClick={() => setWindspeed(opt)}
                                        className={`text-center py-2 rounded-xl text-sm sm:text-base cursor-pointer transition-colors
                                            ${variant.windspeed === opt ? 'bg-[#35455E] text-white' : 'text-white/50 hover:text-white'}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pressure */}
                        <div className="mt-6">
                            <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Pressure</h2>
                            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['hPa','Inches','kPa','mm'].map(opt => (
                                    <li key={opt} onClick={() => setPressure(opt)}
                                        className={`text-center py-2 rounded-xl text-sm sm:text-base cursor-pointer transition-colors
                                            ${variant.pressurre === opt ? 'bg-[#35455E] text-white' : 'text-white/50 hover:text-white'}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Precipitation */}
                        <div className="mt-6">
                            <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Precipitation</h2>
                            <ul className="grid grid-cols-2 gap-2">
                                {['Millimeters','Inches'].map(opt => (
                                    <li key={opt} onClick={() => setPrecipitation(opt)}
                                        className={`text-center py-2 rounded-xl text-sm sm:text-base cursor-pointer transition-colors
                                            ${variant.precipitation === opt ? 'bg-[#35455E] text-white' : 'text-white/50 hover:text-white'}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Distance */}
                        <div className="mt-6">
                            <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Distance</h2>
                            <ul className="grid grid-cols-2 gap-2">
                                {['Kilomiters','miles'].map(opt => (
                                    <li key={opt} onClick={() => setDistance(opt)}
                                        className={`text-center py-2 rounded-xl text-sm sm:text-base cursor-pointer transition-colors
                                            ${variant.distance === opt ? 'bg-[#35455E] text-white' : 'text-white/50 hover:text-white'}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Notifications */}
                    <h2 className="text-[20px] min-[992px]:text-[28px] font-bold text-white mt-8">Notifications</h2>
                    <div className="bg-[#202B3B] px-3 sm:px-5 py-5 sm:py-6 rounded-2xl mt-3 min-[992px]:mt-5 min-[992px]:ml-6">
                        <p className="text-white/70 text-xs sm:text-sm mb-4">
                            Get alerts for rain, floods, cyclones and important weather updates.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                onClick={handleEnableNotifications}
                                disabled={loading || isSubscribed || notifStatus?.type === 'blocked'}
                                className="px-4 py-2 bg-[#4C9BFF] text-white text-sm sm:text-base rounded-xl disabled:opacity-50 transition-opacity"
                            >
                                {loading && !isSubscribed ? 'Enabling...' : isSubscribed ? '✅ Subscribed' : 'Enable Notifications'}
                            </button>
                            {isSubscribed && (
                                <button
                                    onClick={handleDisableNotifications}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-500/80 text-white text-sm sm:text-base rounded-xl disabled:opacity-50 transition-opacity"
                                >
                                    {loading ? 'Unsubscribing...' : 'Unsubscribe'}
                                </button>
                            )}
                        </div>
                        {notifStatus && (
                            <p className={`text-xs sm:text-sm mt-3 ${
                                notifStatus.type === 'success' ? 'text-green-400' :
                                notifStatus.type === 'info'    ? 'text-blue-400'  :
                                notifStatus.type === 'blocked' ? 'text-yellow-400' :
                                'text-red-400'}`}>
                                {notifStatus.type === 'blocked' && '⚠️ '}
                                {notifStatus.type === 'success' && '✅ '}
                                {notifStatus.type === 'info'    && 'ℹ️ '}
                                {notifStatus.type === 'error'   && '❌ '}
                                {notifStatus.text}
                            </p>
                        )}
                    </div>

                </div>
            </section>
        </main>
    );
}

export default Setting;
