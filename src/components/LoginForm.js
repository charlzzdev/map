import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const LoginForm = ({ setLoginFormOpen }) => {
  const handleSubmit = e => {
    e.preventDefault();
    const [email, password] = e.target;

    firebase.auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => setLoginFormOpen(false));
  }

  return (
    <form
      className="login"
      onSubmit={handleSubmit}
    >
      <h2>Bejelentkezés</h2>
      <div className="field">
        <input type="text" id="email" />
        <label htmlFor="email">Email</label>
      </div>
      <div className="field">
        <input type="password" id="password" />
        <label htmlFor="password">Jelszó</label>
      </div>
      <button>Bejelentkezés</button>
    </form>
  )
}

export default LoginForm;