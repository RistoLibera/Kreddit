import React, { useState, useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import Lock from '../../assets/img/lock.png';
import handleFirebaseError from '../../functions/error/handleFirebaseError';

const ChangePassword = (props) => {
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
      console.log(error.code);
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
      console.log(error.code);
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
            <div className='page-loader'>
              <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
            </div>
          :
            <div className='change-container'>
              <form onSubmit={handleChange}>
                <fieldset>
                  <div className={divHidden}>
                    <input type='password' id='old-password' name='old_password' placeholder='Old Password' minLength="6" required/><br></br>
                    <input type='password' id='new-password' name='new_password' placeholder='New Password' minLength="6" required/><br></br>
                    <button className='submit' type='submit' value='Submit'>
                      Confirm
                    </button>
                  </div>
                  <button onClick={switchHidden} type='button'>
                    Change password(up and down arrow)
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
        <img src={Lock} alt='Lock' width="50px"></img>
      </div>
      );
  }
};

export default ChangePassword;