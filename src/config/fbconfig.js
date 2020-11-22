import * as firebase from 'firebase'
let database;
let config = {
    apiKey: "AIzaSyBGAoRBOsaTww7lkimlRAeZjVZxlTsFwEE",
    authDomain: "remotessh-911a7.firebaseapp.com",
    databaseURL: "https://remotessh-911a7.firebaseio.com",
    projectId: "remotessh-911a7",
    storageBucket: "remotessh-911a7.appspot.com",
    messagingSenderId: "513281676368",
    appId: "1:513281676368:web:21891fc93371107ca1ed55",
    measurementId: "G-XNZ6TMYWKS"
  }

firebase.initializeApp(config);
var firestore = firebase.firestore();

// firestore.settings({ timestampsInSnapshots: true })


export default firestore;