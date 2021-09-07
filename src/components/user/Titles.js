import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

const Titles = () => {

  return (
    <div className='title-blocks'>
      <div className='img'>

      </div>

      <div className='title'>
        <h3>group icon + title + entry</h3>
      </div>

      <div className='entry'>
        <button>
          <FontAwesomeIcon icon={faDoorOpen} color='' size='2x' />
          <FontAwesomeIcon icon={faDoorClosed} color='' size='2x' />
        </button>
      </div>
    </div>
  );
};

export default Titles;