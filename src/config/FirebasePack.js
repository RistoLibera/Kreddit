import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

let firebaseConfig = {

  apiKey: "AIzaSyD0m-DvpDN3NRh5NHOJjr3AmGhzacHwC9o",

  authDomain: "kreddit-unpublic-d62c1.firebaseapp.com",

  projectId: "kreddit-unpublic-d62c1",

  storageBucket: "kreddit-unpublic-d62c1.appspot.com",

  messagingSenderId: "1079800175997",

  appId: "1:1079800175997:web:e25a8474dd93aadda80014"

};


const FirebasePack = firebase.initializeApp(firebaseConfig);

export default FirebasePack;
