import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import Recaptcha from 'react-recaptcha';
import { css } from '@emotion/react';
import ClockLoader from 'react-spinners/ClockLoader';
import FirebasePack from '../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import handleFirebaseError from '../components/error/handleFirebaseError';
import '../styles/css/user.css';
import toast from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation('login');
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Grant no access for logged-in-user even via URL 
  if (currentUser) {
    return (
      <Redirect to='/' />
    );
  }

  // Corner notification block
  const alertNotif = (message) => {
    toast((t) => (
      <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faTimesCircle} color='red' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{message}</span>
      </span>
    ));
  };

  // Login existed user
  const loginExisted = async (email, password) => {
    try {
      await FirebasePack
        .auth()
        .signInWithEmailAndPassword(email, password);
        history.push('/');
    } catch (error) {
      let errorMessage = handleFirebaseError(error);
      alertNotif(errorMessage);
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
            <ClockLoader color='#8E5829' css={spinnerCSS} size={100} />
          </div>
        :
          <div className='login-container'>
            <div className="instruction">
              <h1>{t('content.login')}</h1>
              <p>{t('content.instruction')}</p>
            </div>

            <div className='action'>
              <form onSubmit={handleLogin}>
                <fieldset className='name'>
                  <label htmlFor='nickname'>
                    {t('content.nickname')}
                  </label>
                  <input type='text' id='nickname-input' name='nickname' placeholder={t('content.nickname-holder') + '!'} required/><br></br>
                </fieldset>

                <fieldset className='password'>
                  <label htmlFor='password'>{t('content.password')}</label>
                  <input type='password' id='password-input' name='password' placeholder={t('content.password-holder') + '!'} minLength="6" required/><br></br>
                </fieldset>

                <fieldset className='recaptcha'>
                  <Recaptcha
                    className='verification'
                    sitekey="6Le3UlgcAAAAAGDSykaEb3RRHHttIUXqM_d9iHhB"
                    render="explicit"
                    onloadCallback={loadCallback}
                    verifyCallback={verifyIfHuman}
                    theme='dark'
                  />
                </fieldset>

                <fieldset className='buttons'>
                  <button className='reset-button' type='reset' value='Reset'>{t('content.clear')}</button>
                  <button className='submit-button' type='submit' value='Submit' disabled={!isVerified}>{t('content.login')}</button>
                </fieldset>
              </form>
            </div>
          </div>
        }
    </section>
  );
};

export default Login;
