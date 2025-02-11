// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase project is stored on calexcutler@gmail.com account
const firebaseConfig = {
    apiKey: "AIzaSyDbrIlmll4W3jW0GLCSNjGzkXXaWqrq6M8",
    authDomain: "course-tracker-f892d.firebaseapp.com",
    projectId: "course-tracker-f892d",
    storageBucket: "course-tracker-f892d.firebasestorage.app",
    messagingSenderId: "818383863033",
    appId: "1:818383863033:web:62fd223e205560b657b628",
    measurementId: "G-3FQ5NCEW0R"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);