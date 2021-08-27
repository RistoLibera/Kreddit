import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Firebase from '../config/Firebase';
import handleFirebaseError from '../components/error/FirebaseError';
import SelectCountry from '../components/user/SelectCountry';

const Signup = () => {
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState([]);
  const history = useHistory();

  // Input nickname but authenticate with a fake email address
  const handleSignUp = async (event) => {
    event.preventDefault();
    const { nickname, password } = event.target.elements;
    const email = (nickname.value + "@fake.com").toString();

    try {
      await Firebase
        .auth()
        .createUserWithEmailAndPassword(email, password.value);
        history.push("/");
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
    }
  };
  
  // Grant no access for logged-in-user even via URL 
  const controlAccess = () => {
    if (currentUser) {
      history.push("/");
    } else {
      return (
        <div className="signup-page">
          <form onSubmit={handleSignUp}>
            <fieldset className="user-auth">
              <legend>Sign up</legend>
              <label htmlFor="nickname">Nickname</label>
              <input type="text" id="nickname" name="nickname" placeholder="Give yourself a cool nickname!"/><br></br>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="No one will survive without a password"/><br></br>
              <div className="info">
                <div className="gender">
                  <label htmlFor="male">
                    Male
                  </label>
                  <input type="radio" id="male" name="gender" value="male" />
                  <label htmlFor="female">
                    Female
                  </label>
                  <input type="radio" id="female" name="gender" value="female" />
                </div>

                <SelectCountry />
              </div>
              <div className="auth-buttons">
                <button className="reset" type="reset" value="Reset">Clear</button>
                <button className="submit" type="submit" value="Submit">Sign up</button>
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
    <section className="signup-page">
      {controlAccess()}
    </section>
  );
};

export default Signup;
