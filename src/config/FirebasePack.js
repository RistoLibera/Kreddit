import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

let firebaseConfig = {

  apiKey: 'AIzaSyC9T6qvb1JCKtZN8gnrHsJ_NYEI2GpJpu4',

  authDomain: 'kreddit-d2cd8.firebaseapp.com',

  projectId: 'kreddit-d2cd8',

  storageBucket: 'kreddit-d2cd8.appspot.com',

  messagingSenderId: '537953826225',

  appId: '1:537953826225:web:2d3f22ca1f58f675c8b990'

};


const FirebasePack = firebase.initializeApp(firebaseConfig);

export default FirebasePack;
