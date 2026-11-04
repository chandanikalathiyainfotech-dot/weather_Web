const webpush = require('web-push');
const PushSubscription = require('../model/subscription.model');

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:example@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const saveSubscription = async (req, res) => {
  try {
    console.log('saveSubscription called with body:', JSON.stringify(req.body));
    const { subscription, userId } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      console.log('Invalid subscription object');
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription object'
      });
    }

    const existing = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (existing) {
      console.log('Updating existing subscription:', existing._id);
      existing.keys = subscription.keys;
      existing.isActive = true;
      if (userId) existing.userId = userId;
      await existing.save();
      return res.status(200).json({
        success: true,
        message: 'Subscription updated',
        data: existing
      });
    }

    console.log('Creating new subscription');
    const newSub = await PushSubscription.create({
      userId: userId || null,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      isActive: true
    });

    console.log('Created:', newSub._id);
    return res.status(201).json({
      success: true,
      message: 'Subscription saved',
      data: newSub
    });
  } catch (error) {
    console.error('Save subscription error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save subscription'
    });
  }
};

const getVapidPublicKey = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        publicKey: process.env.VAPID_PUBLIC_KEY
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get VAPID key'
    });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { title, body, type, url, icon } = req.body;

    const payload = JSON.stringify({
      title: title || 'Weather Alert',
      body: body || '',
      icon: icon || '/favicon.svg',
      badge: icon || '/favicon.svg',
      data: {
        url: url || '/',
        type: type || 'alert'
      }
    });

    const subscriptions = await PushSubscription.find({ isActive: true });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys
            },
            payload
          );
        } catch (err) {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await PushSubscription.findByIdAndUpdate(sub._id, { isActive: false });
          }
          throw err;
        }
      })
    );

    const failed = results.filter(r => r.status === 'rejected').length;
    const success = results.filter(r => r.status === 'fulfilled').length;

    return res.status(200).json({
      success: true,
      message: `Notifications sent: ${success} success, ${failed} failed`
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send notifications'
    });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ success: false, message: 'Endpoint is required' });
    }

    const sub = await PushSubscription.findOne({ endpoint });
    if (!sub) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    await PushSubscription.findByIdAndDelete(sub._id);

    return res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
  }
};

module.exports = {
  saveSubscription,
  getVapidPublicKey,
  sendNotification,
  unsubscribe
};
