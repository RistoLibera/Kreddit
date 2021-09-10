import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import handleFirebaseError from '../../components/error/handleFirebaseError';

const DeleteUser = (props) => {
  const history = useHistory();
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

  // Delete icon
  const deleteIcon = async () => {
    try {
      await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .delete();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete info
  const deleteInfo = async () => {
    try {
      await FirebasePack
      .firestore()
      .collection('user-info')
      .doc(uid)
      .delete();
    } catch (error) {
      console.log(error);
    }
  };

  // Change owned groups creator
  const disownGroup = async (email) => {
    let creator = (email).slice(0, -9);
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .where('creator', '==', creator)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.update({
              creator: '(DELETE)'
            });    
          });
        });
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      await FirebasePack
        .auth()
        .currentUser
        .delete();
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleChange = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    switchHidden();
    let errorMessage;
    // Prevent erroneous operation
    let confirmation = window.confirm('Are you serious?');
    if (!confirmation) {
      setPageLoading(false);  
      return;
    }
    const { old_password } = event.target.elements;
    const email = currentUser.email;

    errorMessage = await reAuthenticate(email, old_password.value);
    if (errorMessage) {
      alert(errorMessage);
      event.target.reset();
      setPageLoading(false);  
    } else {
      await disownGroup(email);
      await deleteIcon();
      await deleteInfo();  
      await deleteAccount();
      alert('success!');
      history.push('/');  
    }
  };

  if(isCurrentUser()) {
    return (
      <div className='delete-account'>
        {pageLoading
          ?
            <div className='page-loader'>
              <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
            </div>
          :
            <div className='delete-container'>
              <form onSubmit={handleChange}>
                <fieldset>
                  <legend>Delete This User</legend>
                  <div className={divHidden}>
                    <input type='password' id='old-password' name='old_password' placeholder='Old Password' minLength="6" required/><br></br>
                    <button className='submit' type='submit' value='Submit'>
                      Confirm
                    </button>
                  </div>
                  <button onClick={switchHidden} type='button'>
                    <FontAwesomeIcon icon={faUserSlash} color='' size='2x' />
                  </button>
                </fieldset>
              </form>
            </div>
        }
      </div>
    );
  } else {
    return (
      <div className='hidden'>
      </div>
    );
  }
};

export default DeleteUser;