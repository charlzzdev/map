const map = L.map('map').setView([50, 0], 3);

L.tileLayer('./tiles/{z}/{x}_{y}.png', {
  minZoom: 2,
  maxZoom: 4,
  noWrap: true
}).addTo(map);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    document.addEventListener('keydown', e => {
      if (e.key === 'Control') {
        document.getElementById('map').style.cursor = 'crosshair';
      }
    });

    document.addEventListener('keyup', e => {
      document.getElementById('map').style.cursor = '';
    });

    map.on('click', (e) => {
      if (e.originalEvent.ctrlKey) {
        const id = ('id' + e.latlng.lat + e.latlng.lng + Math.random()).split(".").join("");

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
                <input type="file" id="imageInput">
                <label for="imageInput">Kép feltöltés</label>
              </div>
              <button>Hozzáad</button>
            </form>
          `)
          .openOn(map);

        const saveForm = document.getElementById(`${id}`);

        saveForm.addEventListener('submit', async e => {
          e.preventDefault();
          const [title, desc, img] = e.target;
          const latlng = e.target.dataset.latlng;

          await firebase.storage().ref()
            .child(`images/${latlng}.png`)
            .put(img.files[0])
            .then(() => {
              firebase.firestore().collection('markers')
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
});
