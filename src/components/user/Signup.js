import React from 'react';
import Firebase from '../../config/Firebase';

const Signup = () => {

  return (
    <div>
      <button onClick={() => Firebase.auth().Signup()}>Sign out</button>
    </div>
  )
}

export default Signup;
