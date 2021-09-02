import React, { useState, useEffect} from 'react';
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';

//  change view matrix or line
const FilterButtons = () => {

  return (
    <div className="filter-buttons">
      <ul>
        <li>All Discussion</li>
        <li>group one</li>
        <li>group two</li>

      </ul>
      
    </div>
  );
};

export default FilterButtons;