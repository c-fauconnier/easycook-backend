// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyDx7Y0soqZN_k5FindTxNtR0aOyhkzJNzY',
    authDomain: 'easycook-17888.firebaseapp.com',
    projectId: 'easycook-17888',
    storageBucket: 'easycook-17888.appspot.com',
    messagingSenderId: '113727618020',
    appId: '1:113727618020:web:c77cd6ca5c41bc3863e5f1',
    measurementId: 'G-4LTCBSWPJH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
