const loginForm = document.querySelector('.login');

document.addEventListener('keyup', e => {
  if (e.ctrlKey && e.shiftKey && e.altKey && e.key === 'L') {
    loginForm.style.display = 'block';
  }
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const [email, password] = e.target;

  firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(() => loginForm.style.display = 'none')
});
