import React from 'react';
import Firebase from '../../config/Firebase';

const Signout = () => {

  return (
    <div>
      <button onClick={() => Firebase.auth().signOut()}>Sign out</button>
    </div>
  )
}

export default Signout;
