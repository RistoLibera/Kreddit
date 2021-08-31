import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import Koin from '../assets/img/header-koin.png';
import { css } from '@emotion/react';
import CircleLoader from 'react-spinners/CircleLoader';
import Signout from '../components/user/Signout';

const Header = () => {
  const { currentUser,pending } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const history = useHistory();

  // Current profile
  const getProfileURL = () => {
    let profileURL;  
    if(currentUser) {
      profileURL = '/profile/' + currentUser.uid;
    }
    return profileURL;
  };

  // Change registration interface
  const registrationBar = () => {
    if (currentUser) {
      return (
        // converge into one setting block later
        <div className='user-bar'>
          <div>
            <h2>notification</h2>
          </div>
          <div>
          <Link to={getProfileURL}>Profile</Link>
          <Signout />
          </div>
        </div>
      );
    } else if (pending) {
      return (
        <div className='user-bar'>
          <CircleLoader color='#D5D736' css={spinnerCSS} size={50} />
        </div>
      );
    } else {
      return (
        <div className='user-bar'>
          <div>
            <button onClick={() => history.push('/login')} type='button'>
              Log in
            </button>
          </div>
          <div>
            <button onClick={() => history.push('/signup')} type='button'>
              Sign up
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <header className='app-header'>
      <div className='left-bar'>
        <div className='search-bar'>
          <h3>Search? Let's kreddit!</h3>
          <h2></h2>
        </div>
      </div>

      <div className='middle-bar'>
        <div onClick={() => history.push('/discussions')}className='discussions-bar'>
          <h2>Discussion</h2>
        </div>
        <div id='icon' onClick={() => history.push('/')} >
          <img src={Koin} alt='Koin'></img>
        </div>
        <div onClick={() => history.push('/groups')}className='groups-bar'>
          <h2>Group</h2>
        </div>
      </div>

      <div className='right-bar'>
        {registrationBar()}
        <div className='mode-bar'>
          <h2>mode</h2>
        </div>
      </div>
    </header>
  );
};

export default Header;
