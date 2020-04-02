import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import firebase from 'firebase/app';
import 'firebase/auth';

import AppLoading from './components/AppLoading';
import LoginForm from './components/LoginForm';
import Navigation from './components/Navigation';
import ImageViewer from './components/ImageViewer';

import onMapClick from './utils/map/onMapClick';
import getMarkers from './utils/map/getMarkers';

const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tiles, setTiles] = useState('Páprád Helyszínrajz I');
  const [imageInViewer, setImageInViewer] = useState({ src: '', alt: '' });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setUser(user);
      setAppLoading(false);
    });

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
    if (!user || appLoading) return;

    const map = L.map('map').setView([50, 0], 3);

    L.tileLayer(`tiles/${tiles}/{z}/{x}_{y}.png`, {
      minZoom: 2,
      maxZoom: 4,
      noWrap: true
    }).addTo(map);

    if (user?.email === 'admin@admin.admin') onMapClick(map, tiles);

    const unsubGetMarkers = getMarkers(map, tiles);

    return () => {
      unsubGetMarkers();
      map.remove();
    }
  }, [tiles, user, appLoading]);

  const handleKeyDown = e => {
    e.persist();

    if (user?.email === 'admin@admin.admin' && e.ctrlKey) {
      e.target.style.cursor = 'crosshair';
    }
  }

  return (
    <>
      {
        appLoading ? <AppLoading /> :
          user ? <>
            <Navigation
              setTiles={setTiles}
              user={user}
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
          </> : <LoginForm setUser={setUser} />
      }
    </>
  )
}

export default App;