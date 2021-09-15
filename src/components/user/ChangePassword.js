import React, { useState, useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import Lock from '../../assets/img/lock.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import handleFirebaseError from '../../components/error/handleFirebaseError';

const ChangePassword = (props) => {
  const { t } = useTranslation('profile');
  const { uid } = props;
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [divHidden, setDivHidden] = useState("hidden");
  const [pageLoading, setPageLoading] = useState(false);

  const isCurrentUser = () => {
    let currentUID;
    if(currentUser) {
      currentUID = currentUser.uid;
      if(currentUID === uid) {
        return true;
      }
    } else {
      return false;
    }
  };

  const switchHidden = () => {
    if (divHidden === 'hidden') {
      setDivHidden('');
    } else {
      setDivHidden('hidden');
    }
  };

  // Re-authenticate
  const reAuthenticate = async (email, password) => {
    let errorMessage = '';
    const credential = firebase.auth.EmailAuthProvider.credential(
      email, 
      password
    );
    try {
      await
        FirebasePack
        .auth()
        .currentUser
        .reauthenticateWithCredential(credential);
    } catch (error) {
      errorMessage = handleFirebaseError(error);
      console.log(error);
    }
    return errorMessage;
  };

  // Change password
  const changePassword = async (password) => {
    try {
      await FirebasePack
        .auth()
        .currentUser
        .updatePassword(password);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    switchHidden();
    let errorMessage;
    const { old_password, new_password } = event.target.elements;
    const email = currentUser.email;

    errorMessage = await reAuthenticate(email, old_password.value);
    if (errorMessage) {
      alert(errorMessage);
    } else {
      await changePassword(new_password.value);
      alert('success!');  
    }
    event.target.reset();
    setPageLoading(false);
  };

  if(isCurrentUser()) {
    return (
      <div className="change-password">
        {pageLoading
          ?
            <div className='block-loader'>
              <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
            </div>
          :
            <div className='change-container'>
              <button onClick={switchHidden} type='button' className='toggle-show'>
                <FontAwesomeIcon icon={faKey} color='' size='2x' />
              </button>
              <form onSubmit={handleChange} >
                <fieldset className={divHidden}>
                  <legend>{t('content.change-password')}</legend>
                  <input type='password' id='old-password' name='old_password' placeholder={t('content.old-password')} minLength="6" required/><br></br>
                  <input type='password' id='new-password' name='new_password' placeholder={t('content.new-password')} minLength="6" required/><br></br>
                  <button className='submit' type='submit' value='Submit'>
                    {t('content.confirm')}
                  </button>
                </fieldset>
              </form>
            </div>
        }
      </div>
    );
  } else {
    return (
      <div className='lock'>
        <img src={Lock} alt='Lock' width="150px"></img>
      </div>
      );
  }
};

export default ChangePassword;