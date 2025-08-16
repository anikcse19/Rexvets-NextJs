import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let messaging: Messaging | undefined;

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export { firebaseConfig, getToken, messaging, onMessage };
