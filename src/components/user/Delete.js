import React from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../config/Firebase';

const DeleteAccount = () => {
  const history = useHistory();

  const handleDelete = async () => {
    // Prevent erroneous operation
    let confirmation = window.confirm("Are you serious?");
    if (!confirmation) return;

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

  return (
    <div class="delete-account">
      <button onClick={handleDelete} type="button">
        Delete Account
      </button>
    </div>
  );
};

export default DeleteAccount;