import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import Default from '../assets/img/default-icon.jpg';
import { css } from '@emotion/react';
import DotLoader from 'react-spinners/DotLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faMoon } from '@fortawesome/free-solid-svg-icons';
import Koin from '../assets/img/header-koin.png';
import ShowNotif from '../components/notification/ShowNotif';
import Signout from '../components/user/Signout';
import '../styles/css/header.css';


const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: #D5D736;
  speedMultiplier: 0.5;
  `;
  const [showMenu, setShowMenu] = useState('hidden');
  const [iconURL, setIconURL] = useState('');
  const [loading, setLoading] = useState(true);

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    const menu = document.querySelector('#dropdown-menu');
    if (menu.className === 'show' && (!event.target.closest('button') || (event.target.closest('button') && !event.target.closest('button').matches('.dropbtn')))) {
      setShowMenu('hidden');
    }
  };
  
  // Toggle button
  const togglebutton = () => {
    if (showMenu === 'show') {
      setShowMenu('hidden');
    } else {
      setShowMenu('show');
    }
  };

  // Current profile
  const getProfileURL = () => {
    let profileURL;  
    if(currentUser) {
      profileURL = '/profile/' + currentUser.uid;
    }
    return profileURL;
  };  

  // Get icon
  const getIcon = async () => {
    let icon = Default;
    try {
      icon = 
        await FirebasePack
          .storage()
          .ref('user-icon/' + currentUser.uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    setIconURL(icon);
    setLoading(false);
  };


  // Change registration interface
  const makeRegistration = () => {
    if (currentUser) {
      return (
        <div className='user-bar'>
          <ShowNotif />
          <div className="dropdown">
            <button onClick={togglebutton} className="dropbtn">
              {loading 
                ?
                  <DotLoader color='#D5D736' css={spinnerCSS} size={50} />
                :
                  <img src={iconURL} alt='icon' width='30px' />
              }

            </button>
            <div id="dropdown-menu" className={showMenu}>
              <Link className="dropdown-items" to={getProfileURL}>Profile</Link>
              <button className="dropdown-items">Language</button>
              <Signout />
            </div>
          </div>
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

  useEffect(() => {
    getIcon();
  }, []);

  return (
    <header className='app-header'>
      <div className='left-bar'>
        <div className='search-bar'>
          <h3>Search? Let's kreddit!</h3>
          <h2></h2>
        </div>
      </div>

      <div className='middle-bar'>
        <div onClick={() => history.push('/discussions/00')}className='discussions-bar'>
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
        {makeRegistration()}
        <div className='mode-bar'>
          <FontAwesomeIcon icon={faMoon} color='' size='2x' />
          <FontAwesomeIcon icon={faCircle} color='' size='2x' />
        </div>
      </div>
    </header>
  );
};

export default Header;
