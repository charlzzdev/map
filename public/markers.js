const markers = [];

firebase.firestore().collection('markers')
  .onSnapshot(({ docs }) => {
    markers.forEach(marker => map.removeLayer(marker));
    markers.splice(0, markers.length);

    docs.forEach(doc => {
      const { title, desc, latlng } = doc.data();
      latlngArray = latlng.split(',');

      const marker = L.marker(latlngArray, {
        title
      }).addTo(map);

      markers.push(marker);

      firebase.storage().ref().child(`images/${latlng}.png`)
        .getDownloadURL()
        .then(url => {
          marker.bindPopup(`
            <h2>${title}</h2>
            <p>${desc}</p>
            <img src="${url}" style="width: 100%;" />
          `, { minWidth: 300 });
        });
    });
  });

