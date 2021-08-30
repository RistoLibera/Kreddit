import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import handleFirebaseError from '../error/FirebaseError';

// This will be far far complicated
const DeleteAccount = (props) => {
  const history = useHistory();
  const { uid } = props;
  const { currentUser } = useContext(AuthContext);

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

  // Delete account
  const deleteAccount = async () => {
    let errorMessage;
    try {
      await FirebasePack
        .auth()
        .currentUser
        .delete();
    } catch (error) {
      errorMessage = handleFirebaseError(error.code);
      alert(error);
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
  
  const handleDelete = async () => {
    let errorMessage;
    // Prevent erroneous operation
    let confirmation = window.confirm('Are you serious? You may need re-login to delete');
    if (!confirmation) return;

    errorMessage = await deleteAccount();
    await deleteIcon();
    await deleteInfo();  
    history.push('/');  
    
  };

  if(isCurrentUser()) {
    return (
      <div className='delete-account'>
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