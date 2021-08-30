import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';

// This will be far far complicated
const DeleteAccount = (props) => {
  const history = useHistory();
  const { uid } = props;
  const { currentUser } = useContext(AuthContext);
  const [divHidden, setDivHidden] = useState("hidden");

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

  // Delete icon
  const deleteIcon = async () => {
    try {
      await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .delete();
    } catch (error) {
      alert(error);
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
      alert(error);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    try {
      await FirebasePack
        .auth()
        .currentUser
        .delete();
    } catch (error) {
      alert(error);
    }
  };
  
  const handleChange = async (event) => {
    event.preventDefault();
    // Prevent erroneous operation
    let confirmation = window.confirm('Are you serious?');
    if (!confirmation) return;
    const { old_password } = event.target.elements;
    const email = currentUser.email;

    const credential = firebase.auth.EmailAuthProvider.credential(
      email, 
      old_password.value
    );
    FirebasePack.auth().currentUser.reauthenticateWithCredential(credential);

    await deleteIcon();
    await deleteInfo();  
    await deleteAccount();
    setDivHidden('');

    history.push('/');  

  };

  const identifyEntity = async (event) => {
  };

  if(isCurrentUser()) {
    return (
      <div className='delete-account'>
        <form onSubmit={handleChange}>
          <fieldset>
            <div className={divHidden}>
              <input type='password' id='old-password' name='old_password' placeholder='Old Password' required/><br></br>
              <button className='submit' type='submit' value='Submit'>
                Confirm
              </button>
            </div>
            <button onClick={switchHidden} type='button'>
              Delete Account
            </button>
          </fieldset>
        </form>
      </div>
    );
  } else {
    return (
      <div className='hidden'>
      </div>
    );
  }
};

export default DeleteAccount;