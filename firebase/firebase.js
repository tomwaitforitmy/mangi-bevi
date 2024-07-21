// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.firebaseApiKey,
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
const firebaseAuth = getAuth(app);

export { storage, firebaseConfig, firebaseAuth };
