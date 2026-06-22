// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyCEf_yRhhvC3HzVyOGmUSk7uUTx5GAz_Z0',
  appId: '1:52092334690:web:f0338ee7f945d98bfdd73b',
  messagingSenderId: '52092334690',
  projectId: 'inmobiliaria-app-3d87f',
  authDomain: 'inmobiliaria-app-3d87f.firebaseapp.com',
  storageBucket: 'inmobiliaria-app-3d87f.firebasestorage.app',
  measurementId: 'G-L0HPB98RQC',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/Icon-192.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
