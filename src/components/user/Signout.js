import React from 'react';
import { useHistory } from 'react-router-dom';
import FirebasePack from '../../config/FirebasePack';

const Signout = () => {
  const history = useHistory();
  const proceedSignout = () => {
    FirebasePack.auth().signOut();
    history.push('/');
  };

  return (
    <button id='signout' className="dropdown-items" onClick={proceedSignout}  type='button'>
      Sign out
    </button>
  );
};

export default Signout;
