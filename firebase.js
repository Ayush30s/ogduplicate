import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe8NPVUrF5Ab73DiCYxSqZj8xLr6p6z7k",
  authDomain: "gymapp-840d0.firebaseapp.com",
  projectId: "gymapp-840d0",
  storageBucket: "gymapp-840d0.appspot.com",
  messagingSenderId: "578693323569",
  appId: "1:578693323569:web:b55c520ae9c8bd3c1aee10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en'
const provider = new GoogleAuthProvider(); 

const googleLogin = document.getElementById("google-login-btn");

googleLogin.addEventListener("click", function(){
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const user = result.user;
        console.log(user);
        window.location.href = "./views/landing.ejs"
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
})