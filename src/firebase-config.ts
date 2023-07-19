import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoe8I-LpJmd0cow5tpU8hg3i7YBXpXDTY",
  authDomain: "v-contact-48c18.firebaseapp.com",
  projectId: "v-contact-48c18",
  storageBucket: "v-contact-48c18.appspot.com",
  messagingSenderId: "423229995649",
  appId: "1:423229995649:web:63c3b339526ef114f2ab80",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
