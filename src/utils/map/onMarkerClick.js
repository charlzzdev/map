import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

import extraImageUpload from '../form/extraImageUpload';

const onMarkerClick = ({ marker, tiles, latlng, docId }) => {
  marker.on('click', () => {
    if (!marker.getPopup().isOpen()) return;

    const sortSelect = document.getElementById(`sort-${latlng}`);
    sortSelect.addEventListener('change', () => {
      const images = document.querySelectorAll('.marker-images *');
      images.forEach(image => {
        image.style.order = -image.style.order;
      });
    });

    if (firebase.auth().currentUser) {
      const deleteMarkerBtn = document.querySelector(`.danger-btn.delete-marker-${docId}`);
      deleteMarkerBtn.addEventListener('click', () => {
        firebase.firestore()
          .collection(`tiles/${tiles}/markers`)
          .doc(docId)
          .delete();

        firebase.storage().ref()
          .child(`images/${tiles}/${latlng}`)
          .listAll()
          .then(data => {
            data.items.forEach(item => item.delete());
          });
      });
    }

    firebase.storage().ref().child(`images/${tiles}/${latlng}`)
      .listAll()
      .then(data => {
        const markerImages = document.getElementById(latlng);
        const uploadForm = markerImages.parentElement.querySelector('form');
        extraImageUpload(uploadForm, tiles, latlng);

        data.items.forEach(item => {
          item.getDownloadURL()
            .then(url => {
              const fileName = url.split(encodeURIComponent(`${latlng}/`))[1];
              const title = fileName.split('_')[1].split('.')[0];
              const date = fileName.split('_')[0];
              const dateWithoutDots = date.split('.').join('') * -1;

              markerImages.innerHTML += `
                <h2 style="order: ${dateWithoutDots}; margin: 0.75rem 0;">
                  ${date} ${title && '-'} ${title}
                </h2>
                <img src="${url}" style="order: ${dateWithoutDots};">
              `;
            });
        });
      });
  });
}

export default onMarkerClick;
