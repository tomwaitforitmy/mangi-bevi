// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK-NbCaWKt412ZW0uBZP5N87RQHck8KwA",
  // process.env.EXPO_BUILD_FIREBASE_API_KEY ?? //from expo build secrets
  // process.env.EXPO_PUBLIC_FIREBASE_API_KEY, //from my local .env file
  authDomain: "testshop-39aae.firebaseapp.com",
  databaseURL:
    "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testshop-39aae",
  storageBucket: "testshop-39aae.appspot.com",
  messagingSenderId: "387093105080",
  appId: "1:387093105080:web:41b1c881fe71a9bb5f674d",
  measurementId: "G-E15MWRJQEL",
};

const app = initializeApp(firebaseConfig);
// docs fore storage: https://firebase.google.com/docs/storage/web/create-reference
const storage = getStorage(app);

export { storage, firebaseConfig };
