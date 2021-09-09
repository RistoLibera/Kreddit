import React from 'react';
import { useHistory } from 'react-router-dom';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

const Signout = () => {
  const history = useHistory();
  const proceedSignout = () => {
    FirebasePack.auth().signOut();
    history.push('/');
  };

  return (
    <button id='signout' className="dropdown-items" onClick={proceedSignout}  type='button'>
      <FontAwesomeIcon icon={faPowerOff} color='' size='2x' />
      Sign out
    </button>
  );
};

export default Signout;
