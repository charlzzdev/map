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
        L.popup({ minWidth: 250 })
          .setLatLng([e.latlng.lat, e.latlng.lng])
          .setContent(`
            <form class="menu">
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
      }
    });
  }
});
