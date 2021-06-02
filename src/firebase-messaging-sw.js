importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyD5LStBIFDKMWSVrxa1Tchjyu7ZPGNvggw",
    authDomain: "geo-app1.firebaseapp.com",
    databaseURL: "https://geo-app1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "geo-app1",
    storageBucket: "geo-app1.appspot.com",
    messagingSenderId: "538575445999",
    appId: "1:538575445999:web:c8223cd70d043a2802a01a",
    measurementId: "G-95BD53KL7E"
   });
   const messaging = firebase.messaging();