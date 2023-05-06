// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { LogBox } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.firebaseApiKey ?? process.env.REACT_APP_firebaseApiKey,
  authDomain: "testshop-39aae.firebaseapp.com",
  databaseURL:
    "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testshop-39aae",
  storageBucket: "testshop-39aae.appspot.com",
  messagingSenderId: "387093105080",
  appId: "1:387093105080:web:41b1c881fe71a9bb5f674d",
  measurementId: "G-E15MWRJQEL",
};

// Firebase sets some timers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs(["Setting a timer for a long period"]);

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
