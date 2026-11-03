import React from "react";
import { FaCloudSunRain, FaMap } from "react-icons/fa6";
import { TfiMenuAlt } from "react-icons/tfi";
import { RiListSettingsFill } from "react-icons/ri";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import CurrentCity from "../container/CurrentCity";
import Weather from "../container/Weather";
import Map from "../container/Map";
import Setting from "../container/Setting";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { GetCountries, GetAllCities } from "react-country-state-city";


function Siderbar() {

    const menu = [
        { name: 'Weather', icone: <FaCloudSunRain />, path: "/siderbar", exact: true },
        { name: 'Cities', icone: <TfiMenuAlt />, path: '/siderbar/currentcity' },
        { name: 'Map', icone: <FaMap />, path: '/siderbar/maps' },
        { name: 'Setting', icone: <RiListSettingsFill />, path: '/siderbar/setting' }
    ]

    const [search, setSearch] = useState('')
    const [city, setCity] = useState('')
    const [variant, setVarient] = useState({ temp: 'Celsius', windspeed: 'km/h', pressurre: 'Inches', precipitation: 'Millimeters', distance: 'Kilomiters' })
    const [selectedcity, setSelectedcity] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [allItems, setAllItems] = useState([])
    const searchRef = useRef(null)
    const location = useLocation()
    const pageurl = location.pathname;
    const justSelectedRef = useRef(false);

    useEffect(() => {
        const state = location.state
        if (state?.searchCity) {
            const cityFromState = state.searchCity
            const formatted = cityFromState.charAt(0).toUpperCase() + cityFromState.slice(1)
            justSelectedRef.current = true;
            setSearch(cityFromState)
            setCity(cityFromState)
            setSelectedcity(formatted)
            handlestorelocal(cityFromState)
        }
    }, [location.state])

    useEffect(() => {
        setSuggestions([]);
    }, [location.pathname, location.key]);

    useEffect(() => {
        (async () => {
            const countries = await GetCountries();
            const cities = await GetAllCities();
            const items = [
                ...countries.map((c) => c.name),
                ...cities.map((c) => c.name),
            ];
            setAllItems(Array.from(new Set(items)));
            setSuggestions([]);
            justSelectedRef.current = false;
        })();
    }, []);

    useEffect(() => {
        if (pageurl.includes('/currentcity')) { setSuggestions([]); return; }
        if (search.trim() === '') { setSuggestions([]); return; }
        // Don't show suggestions only if search exactly equals city and it's not user typing fresh
        // But better: show suggestions when user is typing different from current city
        if (justSelectedRef.current) {
            // Reset after a tick so user can type again
            const timer = setTimeout(() => { justSelectedRef.current = false; }, 100);
            return () => clearTimeout(timer);
        }
        const q = search.toLowerCase();
        setSuggestions(allItems.filter((n) => n.toLowerCase().includes(q)).slice(0, 10));
    }, [search, allItems, pageurl]);

    useEffect(() => {
        const handler = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    console.log("se", search)

    const handlchnageSearch = (city) => {
        console.log("changecity", city)
        setSearch(city)
        setCity(city)
        setSuggestions([])
    }

    console.log(variant, Object.keys(variant))

    const handleChangeVarinet = (values) => {
        setVarient({ ...variant, ...values })
    }

    function handlestorelocal(city) {
        if (!city || city.trim() === '') return;
        const citylocal = JSON.parse(localStorage.getItem('city')) || [];
        const trimmed = city.trim();
        const check = citylocal.find((v) => typeof v === 'string' && v.toLowerCase() === trimmed.toLowerCase())
        if (!check) {
            // Store in consistent case - capitalize first letter
            const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
            const data = [...citylocal, formatted];
            localStorage.setItem('city', JSON.stringify(data));
        } else {
            // If exists with different case, normalize it
            const normalized = citylocal.map((v) =>
                typeof v === 'string' && v.toLowerCase() === trimmed.toLowerCase()
                    ? (trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase())
                    : v
            );
            localStorage.setItem('city', JSON.stringify(normalized));
        }
    }

    function setSearchvalue(city) {
        justSelectedRef.current = true;
        setSearch(city)
        setSuggestions([])
    }

    function changeselectedvalue(city) {
        console.log("selectcity", city)
        setSelectedcity(city)
    }

    console.log("selectedcity", selectedcity)

    return (
        <main className="flex flex-col min-[992px]:flex-row min-h-screen h-screen px-3 sm:px-5 min-[992px]:px-6 xl:px-10 pt-4 sm:pt-6 min-[992px]:pt-10 pb-20 min-[992px]:pb-10
         bg-[#0B131E] gap-3 sm:gap-4 min-[992px]:gap-5 xl:gap-10 overflow-hidden min-[992px]:overflow-auto">
            {/* Desktop Sidebar */}
            <div className="hidden min-[992px]:flex bg-[#202B3B] w-fit h-full p-4 text-white/70 text-center text-lg rounded-3xl flex-col">
                <nav className="text-center mt-10">
                    {
                        menu?.map((v) => {
                            return (
                                <NavLink
                                    key={v.path}
                                    to={v.path}
                                    end={v.exact}
                                    className={({ isActive }) =>
                                        `flex items-center mt-6 py-3 rounded-xl transition-all justify-center
                                        ${isActive
                                            ? "text-white"
                                            : "text-white/70"
                                        }`
                                    }
                                >
                                    <div className="text-center">
                                        <div className="w-fit text-2xl mx-auto">
                                            {v.icone}
                                        </div>
                                        {v.name}
                                    </div>
                                </NavLink>
                            )
                        })
                    }
                </nav>
            </div>

            <section className={`w-full h-full pb-2 ${pageurl.includes("/siderbar/maps") ? "overflow-auto" : "overflow-auto"} custom-scrollbar`}>
                <form className="relative z-[2000]" ref={searchRef}>
                    <input
                        type="text"
                        placeholder=""
                        className={`
                        ${pageurl.includes("/siderbar/currentcity")
                                ? "block"
                                : "hidden lg:block"
                            }
                            mb-4 sm:mb-4 shrink-0 text-base sm:text-lg
                            text-white bg-[#202B3B] w-full
                            lg:w-[60%] xl:w-[65%] 2xl:w-[70%]
                            px-3 sm:px-4 py-2 sm:py-3 rounded-xl focus:outline-none
                        `}
                        value={search}
                        onChange={(e) => {
                            justSelectedRef.current = false;
                            setSearch(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                const value = search.trim();
                                if (value) {
                                    justSelectedRef.current = true;
                                    setCity(value);
                                }
                                setSuggestions([]);
                                handlestorelocal(value)
                            }
                        }}
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-[2000] bg-[#202B3B] text-white w-full lg:w-[60%] xl:w-[65%] 2xl:w-[70%] rounded-xl mt-1 max-h-60 overflow-auto">
                            {suggestions.map((s, i) => (
                                <li key={i} className="px-3 py-2 hover:bg-white/10 cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        justSelectedRef.current = true;
                                        setSearch(s);
                                        setCity(s);
                                        setSuggestions([]);
                                        handlestorelocal(s);
                                    }}>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>

                <Routes>
                    <Route index element={< Weather search={city} variant={variant} />} />
                    <Route path='/currentcity' element={<CurrentCity search={city} onCangeCity={handlchnageSearch} variant={variant} setSearchvalue={setSearchvalue} changeselectedvalue={changeselectedvalue} selcity={selectedcity} />} />
                    <Route path='/maps' element={<Map search={search} />} />
                    <Route path='/setting' element={<Setting search={city} onchangevarint={handleChangeVarinet} variant={variant} />} />
                </Routes>
            </section>

            {/* Mobile/Tablet Bottom Menu */}
            <nav className="min-[992px]:hidden fixed bottom-0 left-0 right-0 bg-[#202B3B] border-t border-white/10">
                <div className="flex justify-around items-center py-2">
                    {
                        menu?.map((v) => {
                            return (
                                <NavLink
                                    key={v.path}
                                    to={v.path}
                                    end={v.exact}
                                    className={({ isActive }) =>
                                        `flex flex-
                                     items-center justify-center flex-1 py-1 transition-all
                                        ${isActive
                                            ? "text-white"
                                            : "text-white/70"
                                        }`
                                    }
                                >
                                    <div className="text-xl  min-[576px]:text-2xl">
                                        {v.icone}
                                    </div>
                                    <span className="text-[12px] mt-1">{v.name}</span>
                                </NavLink>
                            )
                        })
                    }
                </div>
            </nav>

        </main>
    )
}

export default Siderbar;