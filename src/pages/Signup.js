import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import Recaptcha from 'react-recaptcha';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import FirebasePack from '../config/FirebasePack';
import handleFirebaseError from '../components/error/handleFirebaseError';
import SelectCountry from '../components/user/SelectCountry';
import '../styles/css/user.css';

const Signup = () => {
  const { t } = useTranslation('signup');
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

  // Create new user
  const createNew = async (email, password) => {
    let credential;
    try {
      credential = 
      await FirebasePack
        .auth()
        .createUserWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
      setPageLoading(false);
    }
    return credential;
  };

  // Update nickname, gender and nation to Firestore
  const updateFirestore = async (uid, nickname, gender, nation) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .set({
          nickname: nickname,
          gender: gender,
          nation: nation
        });
      history.push('/');
    } catch (error) {
      console(error.code + ' ' + error.message);
    }
  };

  // Input nickname but authenticate with a fake email address
  const handleSignup = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { nickname, password, gender, nation } = event.target.elements;
    const email = (nickname.value + '@fake.com').toString();

    let credential = await createNew(email, password.value);
    if(credential) {
      await updateFirestore(credential.user.uid, nickname.value, gender.value, nation.value);
    }
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
    <section className='signup-page'>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <div className='signup-container'>
            <form onSubmit={handleSignup}>
              <fieldset className='user-auth'>
                <legend>{t('content.signup')}</legend>
                <label htmlFor='nickname'>{t('content.nickname')}</label>
                <input type='text' id='nickname' name='nickname' placeholder={t('content.nickname-holder')} minLength="3" required/><br></br>
                <label htmlFor='password'>{t('content.password')}</label>
                <input type='password' id='password' name='password' placeholder={t('content.password-holder')} minLength="6" required/><br></br>
                <div className='info'>
                  <div className='gender'>
                    <label htmlFor='male'>
                      <FontAwesomeIcon icon={faMars} color='cornflowerblue' size='lg' />
                    </label>
                    <input type='radio' id='male' name='gender' value='male' checked onChange={e => {}}/>
                    <label htmlFor='female'>
                      <FontAwesomeIcon icon={faVenus} color='crimson' size='lg' />
                    </label>
                    <input type='radio' id='female' name='gender' value='female' />
                  </div>

                  <SelectCountry />
                </div>
                <Recaptcha
                  className='verification'
                  sitekey="6Le3UlgcAAAAAGDSykaEb3RRHHttIUXqM_d9iHhB"
                  render="explicit"
                  onloadCallback={loadCallback}
                  verifyCallback={verifyIfHuman}
                />
                <div className='auth-buttons'>
                  <button className='reset' type='reset' value='Reset'>{t('content.clear')}</button>
                  <button className='submit' type='submit' value='Submit' disabled={!isVerified}>{t('content.signup')}</button>
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

export default Signup;
