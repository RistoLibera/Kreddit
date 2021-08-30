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
  const [formHidden, setFormHidden] = useState("hidden");

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
  
  const handleDelete = async () => {
    // Prevent erroneous operation
    let confirmation = window.confirm('Are you serious? You may need re-login to delete');
    if (!confirmation) return;

    await deleteIcon();
    await deleteInfo();  
    setFormHidden('');
  };

  const identifyEntity = async (event) => {
    event.preventDefault();
    const { password } = event.target.elements;
    const email = currentUser.email;
    const credential = firebase.auth.EmailAuthProvider.credential(
      email, 
      password.value
  );
    FirebasePack.auth().currentUser.reauthenticateWithCredential(credential);
    await deleteAccount();
    history.push('/');  
  };

  if(isCurrentUser()) {
    return (
      <div className='delete-account'>
        <div className={formHidden}>
          <form onSubmit={identifyEntity}>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' name='password' placeholder='Password' required/><br></br>
              <button className='submit' type='submit' value='Submit'>Identify</button>
          </form>
        </div>
        <button onClick={handleDelete} type='button'>
          Delete Account
        </button>
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