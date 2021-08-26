import React, { useState } from 'react';
import Firebase from '../../config/Firebase';

const DeleteAccount = () => {
  const [hidden, setHidden] = useState(true);

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

  return (
    <form onSubmit={handleChange} className="change-password">
      <fieldset>
        <div>
          <input hidden={hidden} type="password" name="password" placeholder="6 or more!"/><br></br>
          <button hidden={hidden} className="submit" type="submit" value="Submit">
            Confirm
          </button>
        </div>
        <button onClick={switchHidden} type="button">
          Change password
        </button>
      </fieldset>
    </form>
  );
};

export default DeleteAccount;