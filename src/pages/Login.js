import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Firebase from '../config/Firebase';
import handleFirebaseError from '../components/error/FirebaseError';

const Login = () => {
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState([]);
  const history = useHistory();

  // Log in via Firebase
  const handleSignUp = async (event) => {
    event.preventDefault();
    // Input nickname but authenticate with a fake email address
    const { nickname, password } = event.target.elements;
    const email = (nickname.value + "@fake.com").toString();

    try {
      await Firebase
        .auth()
        .signInWithEmailAndPassword(email, password.value);
        history.push("/");
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
    }
  };

  const controlAccess = () => {
    if (currentUser) {
      // Grant no access for logged-in-user even via URL 
      history.push("/");
    } else {
      // Login form
      return (
        <div>
          <form onSubmit={handleSignUp}>
            <fieldset className="user-auth">
              <legend>Log in</legend>
              <label htmlFor="nickname">Nickname</label>
              <input type="text" name="nickname" placeholder="Give yourself a cool nickname!"/><br></br>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" placeholder="No one will survive without a password"/><br></br>
              <div className="auth-buttons">
                <button className="reset" type="reset" value="Reset">Clear</button>
                <button className="submit" type="submit" value="Submit">Log in</button>
              </div>
            </fieldset>
          </form>
          <div className="error-message">
            <h2>{errorMessage}</h2>
          </div>
        </div>
      );
    };
  };

  return (
    <section className="login-page">
      {controlAccess()}
    </section>
  );
};

export default Login;
