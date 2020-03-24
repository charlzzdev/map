import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/auth';

import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import ImageViewer from './components/ImageViewer';

import onMapClick from './utils/map/onMapClick';
import getMarkers from './utils/map/getMarkers';

const App = () => {
  const [loginFormOpen, setLoginFormOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [tiles, setTiles] = useState('_');
  const [imageInViewer, setImageInViewer] = useState({ src: '', alt: '' });

  useEffect(() => {
    document.addEventListener('click', e => {
      if (e.target.className === 'marker-img') {
        setImageInViewer({ src: e.target.src, alt: e.target.alt });
      }

      if (e.target.className === 'image-viewer') {
        setImageInViewer({ src: '' });
      }
    });
  }, []);

  useEffect(() => {
    const map = L.map('map').setView([50, 0], 3);

    L.tileLayer(`tiles/${tiles}/{z}/{x}_{y}.png`, {
      minZoom: 2,
      maxZoom: 4,
      noWrap: true
    }).addTo(map);

    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      if (user?.email === 'admin@admin.admin') onMapClick(map, tiles);
    });

    const unsubGetMarkers = getMarkers(map, tiles);

    return () => {
      unsubGetMarkers();
      map.remove();
    }
  }, [tiles, user]);

  const handleKeyDown = e => {
    e.persist();

    if (user?.email === 'admin@admin.admin' && e.ctrlKey) {
      e.target.style.cursor = 'crosshair';
    }
  }

  return (
    <>
      {loginFormOpen && <LoginForm setLoginFormOpen={setLoginFormOpen} />}
      <Navigation
        setTiles={setTiles}
        user={user}
        setLoginFormOpen={setLoginFormOpen}
      />
      {imageInViewer.src && <ImageViewer
        src={imageInViewer.src}
        alt={imageInViewer.alt}
        setImageInViewer={setImageInViewer}
      />}
      <div
        id="map"
        onKeyDown={handleKeyDown}
        onKeyUp={e => e.target.style.cursor = ''}
      ></div>
    </>
  )
}

export default App;