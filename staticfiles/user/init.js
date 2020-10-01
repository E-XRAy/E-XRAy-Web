
var firebaseConfig = {
    apiKey: "AIzaSyC9l5dcHOzEtZ8_LMKx7CO3WM7Nh5V_Snk",
    authDomain: "e-xray-87d05.firebaseapp.com",
    databaseURL: "https://e-xray-87d05.firebaseio.com",
    projectId: "e-xray-87d05",
    storageBucket: "e-xray-87d05.appspot.com",
    messagingSenderId: "106905977677",
    appId: "1:106905977677:web:37ee7de772b55056382d04",
    measurementId: "G-NX9C6NLWXD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();
const storageRef = firebase.storage().ref();