const express = require('express');
const { saveSubscription, getVapidPublicKey, sendNotification } = require('../controller/subscription.controller');
const router = express.Router();

// http://localhost:3000/api/v1/subscription/subscribe
router.post('/subscribe', saveSubscription);
// http://localhost:3000/api/v1/subscription/vapid-public-key
router.get('/vapid-public-key', getVapidPublicKey);
// http://localhost:3000/api/v1/subscription/send
router.post('/send', sendNotification);

module.exports = router;
