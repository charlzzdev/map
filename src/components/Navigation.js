import React, { useState, useEffect } from 'react';

import Collapsible from './Collapsible';

const Navigation = ({ setTiles }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const map = document.getElementById('map');
    map.addEventListener('click', () => setDropdownOpen(false));
  }, []);

  return (
    <nav className="main-nav">
      <button
        className="dropdown-toggle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >Tervek ⏷</button>
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