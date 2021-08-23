import React from 'react';
import Firebase from '../../config/Firebase';

const Login = () => {

  return (
    <div>
      <button onClick={() => Firebase.auth().Login()}>Sign out</button>
    </div>
  )
}

export default Login;
