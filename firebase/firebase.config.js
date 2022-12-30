// Import the functions you need from the SDKs you need
import { getApps, getApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyDWotcGdnRmNIwdonM_YSRdqFn_3qPHykw',
  authDomain: 'book-test-c365d.firebaseapp.com',
  projectId: 'book-test-c365d',
  storageBucket: 'book-test-c365d.appspot.com',
  messagingSenderId: '913255420980',
  appId: '1:913255420980:web:f81055289f6ad01fe8a661',
  measurementId: 'G-RVBGM9F14K',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// let the user choose the account everytime they sign in
// googleProvider.setCustomParameters({ prompt: 'select_account' });
