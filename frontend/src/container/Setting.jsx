import React, { useState } from "react";
import { useEffect } from "react";
import { subscribeToPush, unsubscribeFromPush } from "../utils/push";
import { motion, AnimatePresence } from "framer-motion";


function Setting({ onchangevarint, variant }) {

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
        onchangevarint({ temp, windspeed, pressurre, precipitation, distance })
    }, [temp, windspeed, pressurre, precipitation, distance])

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
            setNotifStatus({ type: 'unsubscribed' });
        } catch (error) {
            setNotifStatus({ type: 'error', text: error.message || 'Failed to unsubscribe' });
        } finally {
            setLoading(false);
        }
    };

    // Detect browser to show correct settings path
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg|OPR/.test(navigator.userAgent);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const host = window.location.hostname;

    function openBrowserNotificationSettings() {
        // chrome:// URLs cannot be opened via window.open() — browser blocks them.
        // Use the real HTTPS settings pages instead.
        if (isChrome || isEdge) {
            // This is the real Chrome/Edge notification settings page
            window.open('https://support.google.com/chrome/answer/3220216', '_blank');
        } else if (isFirefox) {
            window.open('https://support.mozilla.org/en-US/kb/push-notifications-firefox', '_blank');
        } else {
            window.open('https://support.google.com/chrome/answer/3220216', '_blank');
        }
    }

    // ── Framer Motion variants ──────────────────────────────────────────────
    const fadeUp = {
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };
    const slideLeft = {
        hidden: { opacity: 0, x: -40 },
        show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } }
    };
    const slideRight = {
        hidden: { opacity: 0, x: 50 },
        show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: 'easeOut' } }
    };
    const scaleIn = {
        hidden: { opacity: 0, scale: 0.65 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.6, type: 'spring', stiffness: 130 } }
    };
    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: 0.09 } }
    };
    // ────────────────────────────────────────────────────────────────────────

    return (
        <main className="pb-6">
            <h2 className="text-[26px] sm:text-[30px] font-bold text-white min-[992px]:hidden mb-4">Settings</h2>

            <section className="flex py-2 sm:py-6">
                <motion.div id="setting"
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="w-full xl:w-[75%] 2xl:w-[65%]">

                    <h2 className="text-[20px] min-[992px]:text-[28px] font-bold text-white">Units</h2>

                    <motion.div
                        variants={fadeUp}
                        whileHover={{ scale: 1.02, y: -3, transition: { duration: 0.18 } }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#202B3B] px-3 sm:px-5 py-5 sm:py-6 rounded-2xl mt-3 min-[992px]:mt-5 min-[992px]:ml-6">

                        {/* Temperature */}
                        <div>
                            <h2 className="text-xs sm:text-sm font-bold text-white/70 uppercase tracking-wider mb-3">Temperature</h2>
                            <ul className="grid grid-cols-2 gap-2">
                                {['Celsius', 'Fahrenhit'].map(opt => (
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
                                {['km/h', 'm/s', 'knots'].map(opt => (
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
                                {['hPa', 'Inches', 'kPa', 'mm'].map(opt => (
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
                                {['Millimeters', 'Inches'].map(opt => (
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
                                {['Kilomiters', 'miles'].map(opt => (
                                    <li key={opt} onClick={() => setDistance(opt)}
                                        className={`text-center py-2 rounded-xl text-sm sm:text-base cursor-pointer transition-colors
                                            ${variant.distance === opt ? 'bg-[#35455E] text-white' : 'text-white/50 hover:text-white'}`}>
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Notifications */}
                    <h2 className="text-[20px] min-[992px]:text-[28px] font-bold text-white mt-8">Notifications</h2>
                    <motion.div
                        variants={fadeUp}
                        whileHover={{ scale: 1.02, y: -3, transition: { duration: 0.18 } }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#202B3B] px-3 sm:px-5 py-5 sm:py-6 rounded-2xl mt-3 min-[992px]:mt-5 min-[992px]:ml-6">
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
                        {notifStatus && notifStatus.type !== 'unsubscribed' && (
                            <p className={`text-xs sm:text-sm mt-3 ${notifStatus.type === 'success' ? 'text-green-400' :
                                notifStatus.type === 'info' ? 'text-blue-400' :
                                    notifStatus.type === 'blocked' ? 'text-yellow-400' :
                                        'text-red-400'}`}>
                                {notifStatus.type === 'blocked' && '⚠️ '}
                                {notifStatus.type === 'success' && '✅ '}
                                {notifStatus.type === 'info' && 'ℹ️ '}
                                {notifStatus.type === 'error' && '❌ '}
                                {notifStatus.text}
                            </p>
                        )}

                        {/* After unsubscribe — guide to remove browser permission */}
                        {notifStatus?.type === 'unsubscribed' && (
                            <div className="mt-4 bg-[#0B131E] rounded-xl p-4 border border-white/10">
                                <p className="text-blue-400 text-xs sm:text-sm font-semibold mb-2">
                                    ✅ Unsubscribed successfully
                                </p>
                                <p className="text-white/60 text-xs sm:text-sm mb-3">
                                    To fully remove notification permission for this site from your browser:
                                </p>

                                {/* Step-by-step guide */}
                                <ol className="text-white/50 text-xs space-y-1 mb-4 list-decimal list-inside">
                                    {isFirefox ? (
                                        <>
                                            <li>Open Firefox menu → <span className="text-white/70">Settings</span></li>
                                            <li>Go to <span className="text-white/70">Privacy &amp; Security</span></li>
                                            <li>Scroll to <span className="text-white/70">Permissions → Notifications → Settings</span></li>
                                            <li>Find <span className="text-white/70 font-mono">{host}</span> → Remove</li>
                                        </>
                                    ) : isEdge ? (
                                        <>
                                            <li>Open Edge menu → <span className="text-white/70">Settings</span></li>
                                            <li>Go to <span className="text-white/70">Cookies and site permissions → Notifications</span></li>
                                            <li>Under <span className="text-white/70">Allow</span>, find <span className="text-white/70 font-mono">{host}</span></li>
                                            <li>Click the <span className="text-white/70">⋯ menu → Remove</span></li>
                                        </>
                                    ) : (
                                        <>
                                            <li>Open Chrome menu → <span className="text-white/70">Settings</span></li>
                                            <li>Go to <span className="text-white/70">Privacy and security → Site settings → Notifications</span></li>
                                            <li>Under <span className="text-white/70">Allowed to send notifications</span>, find <span className="text-white/70 font-mono">{host}</span></li>
                                            <li>Click the <span className="text-white/70">⋯ menu → Remove</span></li>
                                        </>
                                    )}
                                </ol>

                                {/* Quick action buttons */}
                                <div className="flex flex-wrap gap-2 mt-3">

                                    {/* Copy the internal URL for power users */}
                                    <button
                                        onClick={() => {
                                            const url = isEdge
                                                ? 'edge://settings/content/notifications'
                                                : isFirefox
                                                    ? 'about:preferences#privacy'
                                                    : 'chrome://settings/content/notifications';
                                            navigator.clipboard.writeText(url).then(() => {
                                                alert(`Copied! Paste this in your browser address bar:\n\n${url}`);
                                            });
                                        }}
                                        className="px-3 py-1.5 bg-white/10 text-white/70 text-xs rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        📋 Copy settings URL
                                    </button>

                                    <button
                                        onClick={() => setNotifStatus('')}
                                        className="px-3 py-1.5 bg-white/10 text-white/60 text-xs rounded-lg hover:bg-white/20 transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>

                                {/* Shortcut hint */}
                                <p className="text-white/30 text-[10px] mt-3">
                                    💡 Tip: Click "Copy settings URL" then paste it in your browser address bar to open settings directly.
                                </p>
                            </div>
                        )}
                    </motion.div>

                </motion.div>
            </section>
        </main>
    );
}

export default Setting;
