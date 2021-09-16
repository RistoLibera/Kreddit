import React, { useContext, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import Recaptcha from 'react-recaptcha';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faGoogle, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { css } from '@emotion/react';
import ClockLoader from 'react-spinners/ClockLoader';
import FirebasePack from '../config/FirebasePack';
import handleFirebaseError from '../components/error/handleFirebaseError';
import SelectCountry from '../components/user/SelectCountry';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PersonIcon from '@material-ui/icons/Person';
import '../styles/css/user.css';
import toast from 'react-hot-toast';

const Signup = () => {
  const { t } = useTranslation('signup');
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  margin: 0 auto;
  border-color: red;
  `;
  const [errorMessage, setErrorMessage] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [buttonType, setButtonType] = useState('password');

  // Show password text or not
  const toggleType = () => {
    if (buttonType === 'password') {
      setButtonType('text');
    } else {
      setButtonType('password');
    }
  };

  // Grant no access for logged-in-user even via URL 
  if (currentUser) {
    return (
      <Redirect to='/' />
    );
  }

  // Corner notification block
  const alertNotif = (message) => {
    toast((t) => (
      <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faTimesCircle} color='red' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{message}</span>
      </span>
    ));
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
      let errorMessage = handleFirebaseError(error);
      alertNotif(errorMessage);
      setPageLoading(false);
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
    setPageLoading(true);
    const { nickname, password, gender, nation } = event.target.elements;
    const email = (nickname.value + '@fake.com').toString();

    let credential = await createNew(email, password.value);
    if(credential) {
      await updateFirestore(credential.user.uid, nickname.value, gender.value, nation.value);
    }
  };

  // Load status
  const loadCallback = () => {
    console.log('Recaptcha successfully loads');
  };

  // Verify if being human
  const verifyIfHuman = (response) => {
    if (response) {
      setIsVerified(true);
    }
  };
  
  return (
    <section className='signup-page'>
      {pageLoading
        ?
          <div className='page-loader'>
            <ClockLoader color='#8E5829' css={spinnerCSS} size={100} />
          </div>
        :
          <div className='signup-container'>
            <div className="signup-connect">
              <a className="btn btn-social btn-facebook"><FontAwesomeIcon className="fa fa-facebook" icon={faFacebook} size='lg'/> Sign in with Facebook</a>
              <a className="btn btn-social btn-twitter"><FontAwesomeIcon className="fa fa-twitter" icon={faTwitter} size='lg'/> Sign in with Twitter</a>
              <a className="btn btn-social btn-google"><FontAwesomeIcon className="fa fa-google" icon={faGoogle} size='lg'/> Sign in with Google</a>
              <a className="btn btn-social btn-linkedin"><FontAwesomeIcon className="fa fa-linkedin" icon={faLinkedin} size='lg'/> Sign in with Linkedin</a>
            </div>

            <div className="signup-classic">            
              <form onSubmit={handleSignup}>
                <legend>{t('content.signup')}</legend>
                <fieldset className='name'>
                  <label htmlFor='nickname'>
                    {t('content.nickname')}
                  </label>
                  <input type='text' id='nickname-input' name='nickname' placeholder={t('content.nickname-holder')} minLength="3" maxLength='15' required/><br></br>
                  <PersonIcon className="materials"/>
                </fieldset>

                <fieldset className='password'>
                  <label htmlFor='password'>
                    {t('content.password')}
                  </label>
                  <input type={buttonType} id='password-input' name='password' placeholder={t('content.password-holder')} minLength="6" maxLength='20' required/><br></br>
                  <VisibilityIcon className="materials" id="toggle-visibility" onClick={toggleType}/>
                </fieldset>

                <fieldset className='info'>
                  <div className='gender'>
                    <label htmlFor='male'>
                      <FontAwesomeIcon icon={faMars} color='cornflowerblue' size='2x' />
                    </label>
                    <input type='radio' id='male' name='gender' value='male' checked onChange={e => {}}/>
                    <label htmlFor='female'>
                      <FontAwesomeIcon icon={faVenus} color='crimson' size='2x' />
                    </label>
                    <input type='radio' id='female' name='gender' value='female' />
                  </div>
                  <SelectCountry />
                </fieldset>

                <fieldset className='recaptcha'>
                  <Recaptcha
                    className='verification'
                    sitekey="6Le3UlgcAAAAAGDSykaEb3RRHHttIUXqM_d9iHhB"
                    render="explicit"
                    onloadCallback={loadCallback}
                    verifyCallback={verifyIfHuman}
                    theme='dark'
                  />
                </fieldset>

                <fieldset className='buttons'>
                  <button className='reset-button' type='reset' value='Reset'>{t('content.clear')}</button>
                  <button className='submit-button' type='submit' value='Submit' disabled={!isVerified}>{t('content.signup')}</button>
                </fieldset>
              </form>
              <div className='error-message'>
                <h2>{errorMessage}</h2>
              </div>
            </div>
          </div>
      }
    </section>
  );
};

export default Signup;
