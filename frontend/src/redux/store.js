import { configureStore } from "@reduxjs/toolkit"
import weatherReducer from './slice/weather.slice'

const store = configureStore({
    reducer: {
        weather: weatherReducer
    }
})

export default store;