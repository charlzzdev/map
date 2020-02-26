import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import uuidv4 from 'uuid/v4';

const onMapClick = async (map, tiles) => {
  map.on('click', e => {
    if (e.originalEvent.ctrlKey) {
      const id = uuidv4();

      L.popup({ minWidth: 250 })
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(`
          <form id="${id}" data-latlng="${e.latlng.lat},${e.latlng.lng}">
            <h2>Pont hozzáadása</h2>
            <div class="field">
              <input type="text" id="title">
              <label for="title">Cím</label>
            </div>
            <div class="field">
              <input type="text" id="desc">
              <label for="desc">Leírás</label>
            </div>
            <div class="field">
              <input type="file" id="imageInput" multiple>
              <label for="imageInput">Képek feltöltése</label>
            </div>
            <button>Hozzáad</button>
          </form>
        `)
        .openOn(map);

      const saveForm = document.getElementById(id);

      saveForm.addEventListener('submit', async e => {
        e.preventDefault();
        const [title, desc, img] = e.target;
        const latlng = e.target.dataset.latlng;

        const uploadAllImages = new Promise(resolve => {
          Array.from(img.files).forEach((image, i) => {
            firebase.storage().ref()
              .child(`images/${tiles}/${latlng}/${uuidv4()}.png`)
              .put(image)
              .then(() => {
                if (i === img.files.length - 1) resolve();
              });
          });
        });

        uploadAllImages
          .then(() => {
            firebase.firestore().collection(`tiles/${tiles}/markers`)
              .add({
                title: title.value,
                desc: desc.value,
                latlng
              });
          });

        document.querySelector('.leaflet-popup-close-button').click();
      });
    }
  });
}

export default onMapClick;