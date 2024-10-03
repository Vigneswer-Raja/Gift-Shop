 
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
// import {getFirestore,getDoc, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
 
// const firebaseConfig = {
//     apiKey: "AIzaSyC0Iw28uh92DIAigj16FSZzfb2VDsUN6ds",
//     authDomain: "giftshop-32f9f.firebaseapp.com",
//     projectId: "giftshop-32f9f",
//     storageBucket: "giftshop-32f9f.appspot.com",
//     messagingSenderId: "381846397904",
//     appId: "1:381846397904:web:212fed2b603f2eb8dc4fd5"
//   };
 
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app)
// auth.languageCode = 'en';
// const provider = new GoogleAuthProvider();
 
 
// const googleLoginSignin = document.getElementById("google-login-btn-admin");
// googleLoginSignin.addEventListener("click", function(){
//   signInWithPopup(auth, provider)
// .then((result) => {
//     const user = result.user;
    
//         if (user.email === "vigneshh@gmail.com") {
//             window.location.href = "admin.html"; // Redirect to admin page
//         } else {
//             firebase.auth().signOut(); // Sign out non-admin users
//             document.getElementById('error-message').innerText = "You're not allowed.";
//         }
//     })
//     .catch((error) => {
//         console.error("Error signing in: ", error);
//     });
// });
 
// const signIn = document.getElementById('submitAdminSignIn');
// signIn.addEventListener('click', async (event) => {
//     event.preventDefault();
//     const email = document.getElementById('adminEmail').value.trim();  // Trim whitespace
//     const password = document.getElementById('adminPassword').value;
//     console.log(email);
//     try {
//         // Attempt to sign in with Firebase Auth
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         console.log(user);
//         // Check if the user is an admin
//         if (email === 'vigneshh@gmail.com') {
//             localStorage.setItem('loggedInUserId', user.uid);  // Store user ID locally
//             window.location.href = "admin.html";  // Redirect to admin page
//         } else {
//             showMessage("You're not allowed.", 'signInMessage');  // Non-admin error message
//             await auth.signOut();  // Sign out non-admin users
//         }
//     } catch (error) {
//         console.error("Error during sign-in:", error);
//         showMessage('Incorrect Email or Password', 'signInMessage');  // Show error message
//     }
// });
 

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
// import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyC0Iw28uh92DIAigj16FSZzfb2VDsUN6ds",
//     authDomain: "giftshop-32f9f.firebaseapp.com",
//     projectId: "giftshop-32f9f",
//     storageBucket: "giftshop-32f9f.appspot.com",
//     messagingSenderId: "381846397904",
//     appId: "1:381846397904:web:212fed2b603f2eb8dc4fd5"
// };
 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 const firebaseConfig = {
    apiKey: "AIzaSyC0Iw28uh92DIAigj16FSZzfb2VDsUN6ds",
        authDomain: "giftshop-32f9f.firebaseapp.com",
        projectId: "giftshop-32f9f",
        storageBucket: "giftshop-32f9f.appspot.com",
        messagingSenderId: "381846397904",
        appId: "1:381846397904:web:212fed2b603f2eb8dc4fd5"
};

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else{
            showMessage('unable to create User', 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        showMessage('Login is successful', 'signInMessage');
        const user = userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);

        // Check if the user has a specific email
        if (email === "rajaaa@gmail.com") {
            // Redirect admin user to admin dashboard
            window.location.href = 'admin.html';
        } else {
            // Redirect all other users to the home page
            window.location.href = 'HomePage.html';
        }
    })
    .catch((error) => {
        console.error("Error during sign-in:", error);
        showMessage('Incorrect Email or Password', 'signInMessage');
    });
 });




//     .catch((error)=>{
//         const errorCode=error.code;
//         if(errorCode==='auth/invalid-credential'){
//             showMessage('Incorrect Email or Password', 'signInMessage');
//         }
//         else{
//             showMessage('Account does not Exist', 'signInMessage');
//         }
//     });
//  })