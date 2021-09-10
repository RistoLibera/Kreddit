import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import Recaptcha from 'react-recaptcha';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import FirebasePack from '../config/FirebasePack';
import handleFirebaseError from '../components/error/handleFirebaseError';
import '../styles/css/user.css';

const Login = () => {
  const { t } = useTranslation('login');
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [errorMessage, setErrorMessage] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Grant no access for logged-in-user even via URL 
  if (currentUser) {
    return (
      <Redirect to='/' />
    );
  }

  // Login existed user
  const loginExisted = async (email, password) => {
    try {
      await FirebasePack
        .auth()
        .signInWithEmailAndPassword(email, password);
        history.push('/');
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
      setPageLoading(false);
    }
  };

  // Input nickname but authenticate with a fake email address
  const handleLogin = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { nickname, password } = event.target.elements;
    const email = (nickname.value + '@fake.com').toString();
    await loginExisted(email, password.value);
  };

  // Load status
  const loadCallback = () => {
    console.log('Recaptcha successfully loads');
  };

  // Verify if being human
  const verifyIfHuman = (response) => {
    if (response) {
      setIsVerified(true);
    }
  };

  return (
    <section className='login-page'>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <div className='login-container'>
            <form onSubmit={handleLogin}>
              <fieldset className='user-auth'>
                <legend>{t('content.login')}</legend>
                <label htmlFor='nickname'>{t('content.nickname')}</label>
                <input type='text' id='nickname' name='nickname' placeholder={t('content.nickname') + '!'} required/><br></br>
                <label htmlFor='password'>{t('content.password')}</label>
                <input type='password' id='password' name='password' placeholder={t('content.password') + '!'} minLength="6" required/><br></br>
                <Recaptcha
                  className='verification'
                  sitekey="6Le3UlgcAAAAAGDSykaEb3RRHHttIUXqM_d9iHhB"
                  render="explicit"
                  onloadCallback={loadCallback}
                  verifyCallback={verifyIfHuman}
                />
                <div className='auth-buttons'>
                  <button className='reset' type='reset' value='Reset'>{t('content.clear')}</button>
                  <button className='submit' type='submit' value='Submit' disabled={!isVerified}>{t('content.login')}</button>
                </div>
              </fieldset>
            </form>
            <div className='error-message'>
              <h2>{errorMessage}</h2>
            </div>
          </div>
        }
    </section>
  );
};

export default Login;
