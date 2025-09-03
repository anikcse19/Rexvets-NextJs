import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAXzYNzU0aYaah65xoQjKjE4X2ZxQkuTAk",
  authDomain: "rextvet.firebaseapp.com",
  projectId: "rextvet",
  storageBucket: "rextvet.firebasestorage.app",
  messagingSenderId: "96654090880",
  appId: "1:96654090880:web:964487e4d9e6edafc73c65",
  measurementId: "G-M55Z0V91LQ",
};

let messaging: Messaging | undefined;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { firebaseConfig, getToken, messaging, onMessage };
