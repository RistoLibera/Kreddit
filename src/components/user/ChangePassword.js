import React, { useState, useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import Lock from '../../assets/img/lock.png';

const ChangePassword = (props) => {
  const { uid } = props;
  const { currentUser } = useContext(AuthContext);
  const [divHidden, setDivHidden] = useState("hidden");

  const beCurrentUser = () => {
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

  const handleChange = async (event) => {
    event.preventDefault();
    const { old_password, new_password } = event.target.elements;
    const email = currentUser.email;

    const credential = firebase.auth.EmailAuthProvider.credential(
      email, 
      old_password.value
    );
    FirebasePack.auth().currentUser.reauthenticateWithCredential(credential);

    try {
      await FirebasePack
        .auth()
        .currentUser
        .updatePassword(new_password.value);
      alert('success!');
      switchHidden();
    } catch (error) {
      alert(error);
    }

    event.target.reset();
  };

  const identifyEntity = async (event) => {
  };


  if(beCurrentUser()) {
    return (
      <div className="change-password">
        <form onSubmit={handleChange}>
          <fieldset>
            <div className={divHidden}>
              <input type='password' id='old-password' name='old_password' placeholder='Old Password' required/><br></br>
              <input type='password' id='new-password' name='new_password' placeholder='New Password'/><br></br>
              <button className='submit' type='submit' value='Submit'>
                Confirm
              </button>
            </div>
            <button onClick={switchHidden} type='button'>
              Change password
            </button>
          </fieldset>
        </form>
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