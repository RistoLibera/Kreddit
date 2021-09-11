import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as fasLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as farLightbulb } from '@fortawesome/free-regular-svg-icons';

const DisplayMode = () => {
  const [lighton, setLighton] = useState(true);

  const changeMode = () => {
    setLighton(!lighton);
  };

  return (
    <div className='mode-bar' onClick={changeMode}>
      {lighton
        ?
          <FontAwesomeIcon icon={farLightbulb} color='' size='2x' />
        :
          <FontAwesomeIcon icon={fasLightbulb} color='' size='2x' />
      }
    </div>
  );
};

export default DisplayMode;