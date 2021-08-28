import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Firebase from '../config/Firebase';
import handleFirebaseError from '../components/error/FirebaseError';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState([]);
  const history = useHistory();

  // Input nickname but authenticate with a fake email address
  const handleLogin = async (event) => {
    event.preventDefault();
    const { nickname, password } = event.target.elements;
    const email = (nickname.value + '@fake.com').toString();

    try {
      await Firebase
        .auth()
        .signInWithEmailAndPassword(email, password.value);
        history.push('/');
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
    }
  };

  // Grant no access for logged-in-user even via URL 
  const controlAccess = () => {
    if (currentUser) {
      return (
        <Redirect to="/blog" />
      );
    } else {
      return (
        <div className='login-page'>
          <form onSubmit={handleLogin}>
            <fieldset className='user-auth'>
              <legend>Log in</legend>
              <label htmlFor='nickname'>Nickname</label>
              <input type='text' id='nickname' name='nickname' placeholder='Nickname!'/><br></br>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' name='password' placeholder='Password'/><br></br>
              <div className='auth-buttons'>
                <button className='reset' type='reset' value='Reset'>Clear</button>
                <button className='submit' type='submit' value='Submit'>Log in</button>
              </div>
            </fieldset>
          </form>
          <div className='error-message'>
            <h2>{errorMessage}</h2>
          </div>
        </div>
      );
    }
  };

  return (
    <section className='login-page'>
      {controlAccess()}
    </section>
  );
};

export default Login;
