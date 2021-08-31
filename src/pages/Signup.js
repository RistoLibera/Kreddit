import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import FirebasePack from '../config/FirebasePack';
import handleFirebaseError from '../functions/error/handleFirebaseError';
import SelectCountry from '../components/user/SelectCountry';

const Signup = () => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [errorMessage, setErrorMessage] = useState([]);
  const [pageLoading, setPageLoading] = useState('hidden');
  const [containerClass, setContainerClass] = useState('signup-container');

  const toggleLoading = () => {
    if (pageLoading === 'hidden') {
      setPageLoading('');
      setContainerClass('hidden');  
    }
  };

  // Create new user
  const createNew = async (email, password) => {
    let credential;
    try {
      credential = 
      await FirebasePack
        .auth()
        .createUserWithEmailAndPassword(email, password);
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
    }
    return credential;
  };

  // Update nickname, gender and nation to Firestore
  const updateFirestore = async (uid, nickname, gender, nation) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .set({
          nickname: nickname,
          gender: gender,
          nation: nation
        });
      history.push('/');
    } catch (error) {
      console(error.code + ' ' + error.message);
    }
  };

  // Input nickname but authenticate with a fake email address
  const handleSignup = async (event) => {
    event.preventDefault();
    toggleLoading();
    const { nickname, password, gender, nation } = event.target.elements;
    const email = (nickname.value + '@fake.com').toString();

    let credential = await createNew(email, password.value);
    if(credential) {
      await updateFirestore(credential.user.uid, nickname.value, gender.value, nation.value);
    }
  };
  
  // Grant no access for logged-in-user even via URL 
  const controlAccess = () => {
    if (currentUser) {
      return (
        <Redirect to='/' />
      );
    } else {
      return (
        <div className={containerClass}>
          <form onSubmit={handleSignup}>
            <fieldset className='user-auth'>
              <legend>Sign up</legend>
              <label htmlFor='nickname'>Nickname</label>
              <input type='text' id='nickname' name='nickname' placeholder='Give yourself a cool nickname!' required/><br></br>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' name='password' placeholder='No one will survive without a password' minLength="6" required/><br></br>
              <div className='info'>
                <div className='gender'>
                  <label htmlFor='male'>
                    <FontAwesomeIcon icon={faMars} color='cornflowerblue' size='lg' />
                  </label>
                  <input type='radio' id='male' name='gender' value='male' checked onChange={e => {}}/>
                  <label htmlFor='female'>
                    <FontAwesomeIcon icon={faVenus} color='crimson' size='lg' />
                  </label>
                  <input type='radio' id='female' name='gender' value='female' />
                </div>

                <SelectCountry />
              </div>
              <div className='auth-buttons'>
                <button className='reset' type='reset' value='Reset'>Clear</button>
                <button className='submit' type='submit' value='Submit'>Sign up</button>
              </div>
            </fieldset>
          </form>
          <div className='error-message'>
            <h2>{errorMessage}</h2>
          </div>
        </div>
      );
    }
  };

  return (
    <section className='signup-page'>
      <div className={pageLoading}>
        <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
      </div>

      {controlAccess()}
    </section>
  );
};

export default Signup;
