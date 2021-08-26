import React from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../config/Firebase';

const DeleteAccount = () => {
  const history = useHistory();

  const handleDelete = async () => {
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
    <div class="account-delete">
      <button onClick={handleDelete} type="button">
        Delete Account
      </button>
    </div>
  );
};

export default DeleteAccount;