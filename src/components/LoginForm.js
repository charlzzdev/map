import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const LoginForm = ({ setLoginFormOpen }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    const [email, password] = e.target;

    setError('');
    setLoading(true);

    firebase.auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        setLoading(false);
        setLoginFormOpen(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
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
      {error && <div className="error">{error}</div>}
      <button>
        {!loading ? 'Bejelentkezés' : <div className="loading"></div>}
      </button>
    </form>
  )
}

export default LoginForm;