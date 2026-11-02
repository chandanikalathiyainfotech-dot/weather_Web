const express = require('express');
const { weatherController } = require('../controller');
const router = express.Router();

//http://localhost:3000//api/v1/weather/getweather
router.get('/getweather',weatherController.getWeaterObj);

//http://localhost:3000//api/v1/weather/getmultiplectyWeather
router.get('/getmultiplectyWeather',weatherController.getmultiplectyWeather);

module.exports = router