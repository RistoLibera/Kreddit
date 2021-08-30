import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import FirebasePack from '../config/FirebasePack';
import handleFirebaseError from '../components/error/FirebaseError';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [errorMessage, setErrorMessage] = useState([]);
  const [pageLoading, setPageLoading] = useState('hidden');
  const [containerClass, setContainerClass] = useState('login-container');

  const toggleLoading = () => {
    if (pageLoading === 'hidden') {
      setPageLoading('');
      setContainerClass('hidden');  
    }
  };

  // Login existed account
  const loginExisted = async (email, password) => {
    try {
      await FirebasePack
        .auth()
        .signInWithEmailAndPassword(email, password);
        history.push('/');
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
    }
  };

  // Input nickname but authenticate with a fake email address
  const handleLogin = async (event) => {
    event.preventDefault();
    toggleLoading();
    const { nickname, password } = event.target.elements;
    const email = (nickname.value + '@fake.com').toString();
    await loginExisted(email, password.value);
  };

  // Grant no access for logged-in-user even via URL 
  const controlAccess = () => {
    if (currentUser) {
      return (
        <Redirect to='/' />
      );
    } else {
      return (
        <div className={containerClass}>
          <form onSubmit={handleLogin}>
            <fieldset className='user-auth'>
              <legend>Log in</legend>
              <label htmlFor='nickname'>Nickname</label>
              <input type='text' id='nickname' name='nickname' placeholder='Nickname!' required/><br></br>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' name='password' placeholder='Password' required/><br></br>
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
      <div className={pageLoading}>
        <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
      </div>

      {controlAccess()}
    </section>
  );
};

export default Login;
