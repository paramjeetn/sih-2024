// src/lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVplCL5e7bidwj-8WuruVlX8KgqW_7Zro",
  authDomain: "sih-bitsquad-faa98.firebaseapp.com",
  projectId: "sih-bitsquad-faa98",
  storageBucket: "sih-bitsquad-faa98.appspot.com",
  messagingSenderId: "243506298618",
  appId: "1:243506298618:web:95846eb3fd0fb842701343",
  measurementId: "G-WY2MKSZGNV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, auth };
