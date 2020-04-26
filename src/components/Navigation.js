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
      {
        user && <button
          onClick={() => firebase.auth().signOut()}
        >Kijelentkezés</button>
      }
      <button>
        <div style={{width: '250px'}}>
          Ctrl + klikk új pont lerakásához
        </div>
      </button>
      <button
        className="dropdown-toggle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >Tervek <ChevronDown /></button>
      <div className={`dropdown ${dropdownOpen ? 'open' : 'closed'}`}>
        {
          dropdownOpen && <>
            <Collapsible
              title="Páprád"
              btns={[
                'Helyszínrajz I',
                'Helyszínrajz II'
              ]}
              setTiles={setTiles}
            />
            <Collapsible
              title="Egyéb"
              btns={[]}
              setTiles={setTiles}
            />
          </>
        }
      </div>
    </nav>
  )
}

export default Navigation;