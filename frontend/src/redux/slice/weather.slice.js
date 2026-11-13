
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading: false,
    data: null,
    citiesweather: null,
    error: null
};

export const getWeather = createAsyncThunk(
    'weather/getWeather',
    async (city, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                'http://localhost:3000/api/v1/weather/getweather',
                {
                    params: { city },
                    headers: { 'Cache-Control': 'no-cache' }
                }
            );

            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: error.message || 'Failed to fetch weather'
                }
            );
        }
    }
);

export const getmultiplectyWeather = createAsyncThunk(
    'weather/getmultiplectyWeather',
    async (city, { rejectWithValue }) => {
        try {
            console.log("cityh", city)
            const res = await axios.get(
                'http://localhost:3000/api/v1/weather/getmultiplectyWeather',
                {
                    params: { city: city }
                }
            );

            return res.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: error.message || 'Failed to fetch weather'
                }
            );
        }
    }
)

const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getWeather.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getWeather.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(getWeather.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || {
                    message: action.error.message
                };
            });

        builder
            .addCase(getmultiplectyWeather.pending, (state) => {
                state.isLoading = true,
                    state.error = null
            })
            .addCase(getmultiplectyWeather.fulfilled, (state, action) => {
                state.isLoading = false,
                    state.citiesweather = action.payload;
                state.error = null
            })
            .addCase(getmultiplectyWeather.rejected, (state, action) => {
                state.isLoading = false,
                    state.error = action.payload
            })
    }
});

export default weatherSlice.reducer;
