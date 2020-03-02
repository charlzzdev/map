import React, { useState } from 'react';

import { ChevronDown } from './icons';

const Collapsible = ({ title, btns, setTiles }) => {
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);

  return (
    <div className="collapsible">
      <button onClick={() => setCollapsibleOpen(!collapsibleOpen)}>{title} <ChevronDown /></button>
      <div className={`collapsible-body ${collapsibleOpen ? 'open' : 'closed'}`}>
        {
          btns.map(btnText => <button
            key={btnText}
            onClick={() => setTiles(`${title} ${btnText}`)}
          >{btnText}</button>)
        }
      </div>
    </div>
  )
}

export default Collapsible;
