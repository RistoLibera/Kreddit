import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './Auth';
import Firebase from '../../config/Firebase';

const DeleteAccount = (props) => {
  const history = useHistory();
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
  
  const handleDelete = async () => {
    // Prevent erroneous operation
    let confirmation = window.confirm("Are you serious?");
    if (!confirmation) return;

    // Delete icon
    try {
      await Firebase
          .storage()
          .ref("user-icon/" + uid + "/icon.jpg")
          .delete();
      history.push("/");
    } catch (error) {
      alert(error);
    }

    // Delete account
    try {
      await Firebase
        .auth()
        .currentUser
        .delete();
        history.push("/");
    } catch (error) {
      alert(error);
    }
  };

  if(beCurrentUser()) {
    return (
      <div className="delete-account">
        <button onClick={handleDelete} type="button">
          Delete Account
        </button>
      </div>
    );
  } else {
    return (
      <div classname="hidden">

      </div>
    );
  }
};

export default DeleteAccount;