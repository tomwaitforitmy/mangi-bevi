// Import the functions you need from the SDKs you need
import firebase from "firebase";
import { LogBox } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK-NbCaWKt412ZW0uBZP5N87RQHck8KwA",
  authDomain: "testshop-39aae.firebaseapp.com",
  databaseURL:
    "https://testshop-39aae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "testshop-39aae",
  storageBucket: "testshop-39aae.appspot.com",
  messagingSenderId: "387093105080",
  appId: "1:387093105080:web:41b1c881fe71a9bb5f674d",
  measurementId: "G-E15MWRJQEL",
};

// Firebase sets some timeers for a long period, which will trigger some warnings. Let's turn that off for this example
LogBox.ignoreLogs([`Setting a timer for a long period`]);

let firebaseapp;
if (!firebase.apps.length) {
  firebaseapp = firebase.initializeApp(firebaseConfig);
}
const storage = firebase.storage();

export { storage };
