const express = require('express')
const router = express.Router()
const weatherRoutes = require('./weather.routes')

//http://localhost:3000//api/v1/weather
router.use('/weather',weatherRoutes)


module.exports = router