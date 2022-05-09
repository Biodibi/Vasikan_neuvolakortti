import firebase from 'firebase/compat';

const firebaseConfig = ({
  });

const app = firebase.initializeApp(firebaseConfig);
export const db = app.database();
export const ROOT_REF = '/cows/';
export const settings = 'settings/';