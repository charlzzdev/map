import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';

import App from './App';
import './styles.css';

firebase.initializeApp({
  apiKey: "AIzaSyDOPdYJ6J9YDCKznF0M1hyV9owZT2sMHTU",
  authDomain: "tervkepek.firebaseapp.com",
  databaseURL: "https://tervkepek.firebaseio.com",
  projectId: "tervkepek",
  storageBucket: "tervkepek.appspot.com",
  messagingSenderId: "246240089782",
  appId: "1:246240089782:web:b5dbd80a415a1912caf817"
});

ReactDOM.render(<App />, document.getElementById('root'));
