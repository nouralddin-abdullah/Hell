import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAh61dWtgbPdnq65nvVOp4eCc3y6FU0FHs",
  authDomain: "bishell.firebaseapp.com",
  projectId: "bishell",
  storageBucket: "bishell.firebasestorage.app",
  messagingSenderId: "307741969922",
  appId: "1:307741969922:web:c54b2131957d9acf37611b",
  measurementId: "G-EEF22G6JTR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = getMessaging(app);

export { messaging };
