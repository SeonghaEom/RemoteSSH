import * as firebase from 'firebase'
let database;
let config = {

  }

firebase.initializeApp(config);
var firestore = firebase.firestore();

// firestore.settings({ timestampsInSnapshots: true })


export default firestore;