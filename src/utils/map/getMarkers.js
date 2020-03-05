import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import onMarkerClick from './onMarkerClick';

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

        onMarkerClick({
          marker,
          tiles,
          latlng,
          docId: doc.id
        });
      });
    });
}

export default getMarkers;
