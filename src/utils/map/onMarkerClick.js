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

    if (firebase.auth().currentUser?.email === 'admin@admin.admin') {
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

    const markerImages = document.getElementById(latlng);
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.style = 'border-color: #333; border-right-color: transparent;';
    markerImages.parentElement.insertBefore(loadingDiv, markerImages);

    firebase.storage().ref().child(`images/${tiles}/${latlng}`)
      .listAll()
      .then(data => {
        const uploadForm = markerImages.parentElement.querySelector('form');
        extraImageUpload(uploadForm, tiles, latlng);

        data.items.forEach((item, i) => {
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
                <img 
                  src="${url}" 
                  class="marker-img" 
                  alt="${title}"
                  style="order: ${dateWithoutDots};"
                >
              `;

              if (i === data.items.length - 1) {
                markerImages.parentElement.removeChild(loadingDiv);
              }
            });
        });
      });
  });
}

export default onMarkerClick;
