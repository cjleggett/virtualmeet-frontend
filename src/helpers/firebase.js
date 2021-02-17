import firebase from "firebase/app";
import "firebase/auth";
import { PRODUCTION } from "./constants"

const firebaseInfo = 
  PRODUCTION ? {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  }
  :
  {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL_DEV,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
    appId: process.env.REACT_APP_FIREBASE_APP_ID_DEV,
  }


const app = firebase.initializeApp(firebaseInfo);

export const auth = app.auth();
export default app;
