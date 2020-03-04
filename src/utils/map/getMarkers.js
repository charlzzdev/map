import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import extraImageUpload from '../form/extraImageUpload';

const getMarkers = (map, tiles) => {
  const markers = [];

  firebase.firestore().collection(`tiles/${tiles}/markers`)
    .onSnapshot(({ docs }) => {
      markers.forEach(marker => map.removeLayer(marker));
      markers.splice(0, markers.length);

      docs.forEach(doc => {
        const { title, desc, latlng } = doc.data();
        const latlngArray = latlng.split(',');

        const marker = L.marker(latlngArray, {
          title
        }).addTo(map);

        markers.push(marker);

        marker.bindPopup(`
          <h2>
            ${title}
            ${firebase.auth().currentUser ? `
              <button class="danger-btn delete-marker">Törlés</button>
            ` : ''}
          </h2>
          <p>${desc}</p>
          ${firebase.auth().currentUser ? `
            <form>
              <input type="file" multiple>
              <button style="margin: 0.5rem 0;">Hozzáad</button>
              <div class="error"></div>
            </form>
          ` : ''}
          <select id="sort-${latlng}">
            <option value="desc">Legújabb képek elöl</option>
            <option value="asc">Legrégebbi képek elöl</option>
          </select>
          <div class="marker-images" id="${latlng}"></div>
        `, { minWidth: 300 });

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
            const deleteMarkerBtn = document.querySelector(`.danger-btn.delete-marker`);
            deleteMarkerBtn.addEventListener('click', () => {
              firebase.firestore()
                .collection(`tiles/${tiles}/markers`)
                .doc(doc.id)
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
      });
    });
}

export default getMarkers;
