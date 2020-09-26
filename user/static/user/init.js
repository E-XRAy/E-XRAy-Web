
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD6PC6QQ9u5spFX8_CvZ5pOIzupRWtDpEk",
    authDomain: "exray-trial.firebaseapp.com",
    databaseURL: "https://exray-trial.firebaseio.com",
    projectId: "exray-trial",
    storageBucket: "exray-trial.appspot.com",
    messagingSenderId: "924340290366",
    appId: "1:924340290366:web:af7600fb775bb90259a26f",
    measurementId: "G-WXCG6RWVZE"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const auth = firebase.auth();
const db = firebase.firestore();