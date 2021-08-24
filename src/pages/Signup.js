import React, { useContext, useCallback } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Firebase from '../config/Firebase';

const Signup = () => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  // Prevent unnecessary re-rendering
  const handleSignUp = useCallback(async (event) => {
    event.preventDefault();
    // Input nickname but authenticate with a fake email address
    const { nickname, password } = event.target.elements;
    const email = (nickname.value + "@fake.com").toString();
    try {
      await Firebase
        .auth()
        .createUserWithEmailAndPassword(email, password.value);
        history.push("/");
    } catch (error) {
      alert(error);
    }
  }, [history]);

  const controlAccess = () => {
    if (currentUser) {
      // No access even via URL for logged-in-user
      <Redirect to="/" />
    } else {
      // Signup form
      return (
        <div>
          <form onSubmit={handleSignUp}>
            <fieldset>
              <legend>Sign up</legend>
              <label htmlFor="nickname">Nickname</label>
              <input className="form-bar" type="text" name="nickname" placeholder="Give yourself a cool nickname!"/><br></br>
              <label htmlFor="password">Password</label>
              <input className="form-bar" type="password" name="password" placeholder="No one will survive without a password"/><br></br>
              <button type="submit" value="Submit">Sign up</button>
            </fieldset>
          </form>
        </div>
      );
    };
  };

  return (
    <section>
      {controlAccess()}
    </section>
  );
};

export default Signup;
