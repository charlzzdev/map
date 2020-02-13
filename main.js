const map = L.map('map').setView([50, 0], 3);

L.tileLayer('./tiles/{z}/{x}_{y}.png', {
  minZoom: 2,
  maxZoom: 4,
  noWrap: true
}).addTo(map);

const circle = L.circle([51.508, -0.11], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 500000
}).addTo(map);

circle.bindPopup('<img src="https://via.placeholder.com/200">');

map.on('click', (e) => {
  const marker = L.marker([e.latlng.lat, e.latlng.lng], {
    radius: 500000
  }).addTo(map);

  const popup = L.popup()
    .setLatLng([e.latlng.lat, e.latlng.lng])
    .setContent("<h2>Upload an image here</h2> <input type='file'>")
    .openOn(map);
});