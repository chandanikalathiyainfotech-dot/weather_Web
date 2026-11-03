const express = require('express')
const router = express.Router()
const weatherRoutes = require('./weather.routes')
const subscriptionRoutes = require('./subscription.routes')

//http://localhost:3000//api/v1/weather
router.use('/weather',weatherRoutes)
//http://localhost:3000//api/v1/subscription
router.use('/subscription', subscriptionRoutes)


module.exports = router
