import firebase from 'firebase/app';
import 'firebase/auth';

import validateImages from './validateImages';

const extraImageUpload = (markerImages, tiles, latlng) => {
  if (!firebase.auth().currentUser) return;

  markerImages.innerHTML = `
    <form>
      <input type="file" multiple>
      <button style="margin: 0.5rem 0;">Hozzáad</button>
      <div class="error"></div>
    </form>
  `;

  markerImages.addEventListener('submit', e => {
    e.preventDefault();
    const [input, button, errorDiv] = e.target.children;
    const images = Array.from(input.files);

    if (!validateImages(images, errorDiv)) return;

    errorDiv.innerText = '';
    button.innerHTML = '<div class="loading"></div>';

    images.forEach((image, i) => {
      firebase.storage().ref()
        .child(`images/${tiles}/${latlng}/${image.name}`)
        .put(image)
        .then(() => {
          if (i === images.length - 1) {
            button.innerText = 'Hozzáad';
            document.querySelector('.leaflet-popup-close-button').click();
          }
        })
        .catch(err => {
          button.innerText = 'Hozzáad';
          errorDiv.innerText = err.message;
        });
    });
  });
}

export default extraImageUpload;