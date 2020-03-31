import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

import Collapsible from './Collapsible';
import { ChevronDown } from './icons';

const Navigation = ({ setTiles, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const map = document.getElementById('map');
    map.addEventListener('click', () => setDropdownOpen(false));
  }, []);

  return (
    <nav className="main-nav">
      <button
        onClick={() => firebase.auth().signOut()}
      >Kijelentkezés</button>
      <button
        className="dropdown-toggle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >Tervek <ChevronDown /></button>
      <div className={`dropdown ${dropdownOpen ? 'open' : 'closed'}`}>
        {
          dropdownOpen && <>
            {!user && 'Jelentkezz be a terveid megtekintéséhez.'}
            {
              (user?.email === 'paprad@a.bc' || user?.email === 'admin@admin.admin')
              && <Collapsible
                title="Páprád"
                btns={[
                  'Helyszínrajz I',
                  'Helyszínrajz II'
                ]}
                setTiles={setTiles}
              />
            }
            {
              user?.email === 'admin@admin.admin'
              && <Collapsible
                title="Egyéb"
                btns={[]}
                setTiles={setTiles}
              />
            }
          </>
        }
      </div>
    </nav>
  )
}

export default Navigation;