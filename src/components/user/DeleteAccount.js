import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './Auth';
import Firebase from '../../config/Firebase';

const DeleteAccount = (props) => {
  const history = useHistory();
  const { uid } = props;
  const { currentUser } = useContext(AuthContext);

  const beingCurrentUser = () => {
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
  
  const handleDelete = async () => {
    // Prevent erroneous operation
    let confirmation = window.confirm('Are you serious?');
    if (!confirmation) return;

    // Delete account
    try {
      await Firebase
        .auth()
        .currentUser
        .delete();
    } catch (error) {
      alert(error);
    }
    
    // Delete icon
    try {
      await Firebase
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .delete();
    } catch (error) {
      alert(error);
    }

    // Delete Info
    try {
      await Firebase
      .firestore()
      .collection('user-info')
      .doc(uid)
      .delete();
    } catch (error) {
      alert(error);
    }

    history.push('/');
  };

  if(beingCurrentUser()) {
    return (
      <div className='delete-account'>
        <button onClick={handleDelete} type='button'>
          Delete Account
        </button>
      </div>
    );
  } else {
    return (
      <div classname='hidden'>

      </div>
    );
  }
};

export default DeleteAccount;