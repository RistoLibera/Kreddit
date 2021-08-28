import React, { useState, useContext } from 'react';
import Firebase from '../../config/Firebase';
import { AuthContext } from './Auth';
import Lock from '../../assets/img/lock.png';

const ChangePassword = (props) => {
  const [hidden, setHidden] = useState(true);
  const { uid } = props;
  const { currentUser } = useContext(AuthContext);

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
    setHidden(!hidden);
  };

  const handleChange = async (event) => {
    event.preventDefault();
    const { password } = event.target.elements;

    try {
      await Firebase
        .auth()
        .currentUser
        .updatePassword(password.value);
      setHidden(!hidden);
    } catch (error) {
      console.log(error.code)
    }
  };

  if(beCurrentUser()) {
    return (
      <form onSubmit={handleChange} className='change-password'>
        <fieldset>
          <div>
            <input hidden={hidden} type='password' name='password' placeholder='6 or more!'/><br></br>
            <button hidden={hidden} className='submit' type='submit' value='Submit'>
              Confirm
            </button>
          </div>
          <button onClick={switchHidden} type='button'>
            Change password
          </button>
        </fieldset>
      </form>
    );
  } else {
    return (
      <div className='lock'>
        <img src={Lock} alt='Lock'></img>
      </div>
      );
  }
};

export default ChangePassword;