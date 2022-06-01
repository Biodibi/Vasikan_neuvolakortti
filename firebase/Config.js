import firebase from 'firebase/compat';

const firebaseConfig = ({
    apiKey: "AIzaSyBb7fEp0Shd4cdao1zADzfFEcRlXdpGbtw",
    authDomain: "neuvolakortti-1dd02.firebaseapp.com",
    databaseURL: "https://neuvolakortti-1dd02-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "neuvolakortti-1dd02",
    storageBucket: "neuvolakortti-1dd02.appspot.com",
    messagingSenderId: "451298330271",
    appId: "1:451298330271:web:0be00e2f191e3b72f7c4aa"
  });

const app = firebase.initializeApp(firebaseConfig);
export const db = app.database();
export const ROOT_REF = '/cows/';