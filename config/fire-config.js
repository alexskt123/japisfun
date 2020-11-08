// const firebase = require('firebase/app')
// // Required for side-effects
// require('firebase/firestore')
// require('firebase/database')

import firebase from "firebase/app";
require('firebase/firestore')
require('firebase/database')

const firebaseConfig = {
  apiKey: 'AIzaSyDEwwLgsx-xntRMCRzXO2xcbBhX3POHlcs',
  authDomain: 'japisfun.firebaseapp.com',
  databaseURL: 'https://japisfun.firebaseio.com/',
  projectId: 'japisfun',
  storageBucket: 'asia-east2.appspot.com',
  messagingSenderId: '857380421757',
  appId: '857380421757'
}
try {
  firebase.initializeApp(firebaseConfig)
} catch (err) {
  if (!/already exists/.test(err.message)) {
    console.error('Firebase initialization error', err.stack)
  }
}

export default firebase
