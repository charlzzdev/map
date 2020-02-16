import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/auth';

import LoginForm from './components/LoginForm';
import onMapClick from './utils/map/onMapClick';
import getMarkers from './utils/map/getMarkers';

const App = () => {
  const [loginFormOpen, setLoginFormOpen] = useState(false);

  useEffect(() => {
    const map = L.map('map').setView([50, 0], 3);

    L.tileLayer('/tiles/{z}/{x}_{y}.png', {
      minZoom: 2,
      maxZoom: 4,
      noWrap: true
    }).addTo(map);

    firebase.auth().onAuthStateChanged(user => {
      if (user) onMapClick(map);
    });

    getMarkers(map);
  }, []);

  const handleKeyDown = async e => {
    e.persist();

    if (firebase.auth().currentUser) {
      if (e.ctrlKey) {
        e.target.style.cursor = 'crosshair';
      }
    } else {
      if (e.ctrlKey && e.altKey && e.shiftKey && e.key === 'L') {
        setLoginFormOpen(true);
      }
    }
  }

  return (
    <>
      {loginFormOpen && <LoginForm setLoginFormOpen={setLoginFormOpen} />}
      <div
        id="map"
        onKeyDown={handleKeyDown}
        onKeyUp={e => e.target.style.cursor = ''}
      ></div>
    </>
  )
}

export default App;