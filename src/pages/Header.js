import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faMoon, faUserCog } from '@fortawesome/free-solid-svg-icons';
import Koin from '../assets/img/header-koin.png';
import Signout from '../components/user/Signout';
import '../styles/css/header.css';


const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [showMenu, setShowMenu] = useState('hidden');

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

  // Change registration interface
  const makeRegistration = () => {
    if (currentUser) {
      return (
        <div className='user-bar'>
          <div>
            <h2>notification</h2>
          </div>

          <div className="dropdown">
            <button onClick={togglebutton} className="dropbtn">
              <FontAwesomeIcon icon={faUserCog} color='' size='2x' />
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
