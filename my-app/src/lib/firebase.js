import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAulwUA5scCpq49gjoFOjKd2SfmDsxVp3o",
  authDomain: "final2-ffd40.firebaseapp.com",
  projectId: "final2-ffd40",
  storageBucket: "final2-ffd40.firebasestorage.app",
  messagingSenderId: "957058997711",
  appId: "1:957058997711:web:1910287064f3b95d9646ba",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
