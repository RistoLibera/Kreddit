import React from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../config/Firebase';

const Signout = () => {
  const history = useHistory();

  const proceedSignout = () => {
    Firebase.auth().signOut();
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
