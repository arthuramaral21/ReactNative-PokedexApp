// Services/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2-EaaVHTaCfNHh4RPZtFlT2lQZByZ1PE",
  authDomain: "pokedexapp-68ebf.firebaseapp.com",
  projectId: "pokedexapp-68ebf",
  storageBucket: "pokedexapp-68ebf.firebasestorage.app",
  messagingSenderId: "1079858357022",
  appId: "1:1079858357022:web:b6e289fff04a16de91df0f",
  measurementId: "G-C169E5E8WN",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);