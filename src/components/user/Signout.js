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
    <div id='signout'>
      <button onClick={proceedSignout}  type='button'>
        Sign out
      </button>
    </div>
  );
};

export default Signout;
