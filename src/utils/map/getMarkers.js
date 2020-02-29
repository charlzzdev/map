import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

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
          <h2>${title}</h2>
          <p>${desc}</p>
          <div class="marker-images" id="${latlng}"></div>
        `, { minWidth: 300 });

        marker.on('click', () => {
          if (!marker.getPopup().isOpen()) return;
          firebase.storage().ref().child(`images/${tiles}/${latlng}`)
            .listAll()
            .then(data => {
              data.items.forEach(item => {
                item.getDownloadURL()
                  .then(url => {
                    const fileName = url.split(encodeURIComponent(`${latlng}/`))[1];
                    const sequenceNumber = fileName.split('_')[0];

                    document.getElementById(latlng).innerHTML += `
                      <img src="${url}" style="order: ${sequenceNumber};">
                    `;
                  });
              });
            });
        });
      });
    });
}

export default getMarkers;
