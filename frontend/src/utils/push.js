const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('SW registered:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
  throw new Error('Service Worker not supported');
};

export const subscribeToPush = async (apiBaseUrl = 'http://localhost:3000/api/v1') => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications not supported');
  }

  const registration = await registerServiceWorker();
  const permission = await Notification.requestPermission();
  console.log('Notification permission:', permission);
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  const vapidRes = await fetch(`${apiBaseUrl}/subscription/vapid-public-key`);
  const vapidJson = await vapidRes.json();
  console.log('VAPID response:', vapidJson);
  const publicKey = vapidJson.data.publicKey;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  });
  console.log('Push subscription obtained:', subscription.endpoint);

  const subJson = subscription.toJSON ? subscription.toJSON() : subscription;
  const res = await fetch(`${apiBaseUrl}/subscription/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ subscription: subJson })
  });

  const result = await res.json();
  console.log('Subscribe API result:', result);
  return result;
};
