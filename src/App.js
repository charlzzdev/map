import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/auth';

import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';

import onMapClick from './utils/map/onMapClick';
import getMarkers from './utils/map/getMarkers';

const App = () => {
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [tiles, setTiles] = useState('Páprád Helyszínrajz I');

  useEffect(() => {
    const map = L.map('map').setView([50, 0], 3);

    L.tileLayer(`tiles/${tiles}/{z}/{x}_{y}.png`, {
      minZoom: 2,
      maxZoom: 4,
      noWrap: true
    }).addTo(map);

    firebase.auth().onAuthStateChanged(user => {
      if (user) onMapClick(map, tiles);
    });

    getMarkers(map, tiles);
    return () => map.remove();
  }, [tiles]);

  const handleKeyDown = e => {
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
      <Navigation setTiles={setTiles} />
      <div
        id="map"
        onKeyDown={handleKeyDown}
        onKeyUp={e => e.target.style.cursor = ''}
      ></div>
    </>
  )
}

export default App;