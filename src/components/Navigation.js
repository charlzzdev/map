import React, { useState } from 'react';

import Collapsible from './Collapsible';

const Navigation = ({ setTiles }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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