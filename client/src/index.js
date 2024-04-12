import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyC-kq2NvMqE26AB8paUQ8Kqc1Sra8qOzvY",
  authDomain: "comic-stop.firebaseapp.com",
  projectId: "comic-stop",
  storageBucket: "comic-stop.appspot.com",
  messagingSenderId: "167116924758",
  appId: "1:167116924758:web:83c5b8071520bd5377d8f7",
  measurementId: "G-YTLJQK6MFB",
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
