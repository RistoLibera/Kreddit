import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Koin from '../assets/Header-Koin.png';
import '../styles/css/header.css';
import Signout from '../components/user/Signout';

const Header = () => {
  const { currentUser } = useContext(AuthContext);

  // Change registration interface
  const registrationBar = () => {
    if (currentUser) {
      return (
        // converge into one setting block later
        <div className="user-bar">
          <Signout />
          <h2>notification</h2>
          <Link to="./profile">Profile</Link>
        </div>
      )
    } else {
      return (
        <div className="user-bar">
          <div>
            <h2>Login</h2>
          </div>
        
          <div>
            <h2>Signup</h2>
          </div>
        </div>
      )
    };
  };

  return (
    <header id="app-header">
      <div className="first-left-bar">
        <div id="icon">
          <img src={Koin} alt="Koin"></img>
        </div>
        <div id="home-link">
          <h1>kreddit</h1>
        </div>
        <div id="search-bar">
          <h3>Search?</h3>
        </div>
      </div>

      <div className="first-right-bar">
        {registrationBar()}
        <div className="mode-bar">
          <h2>mode</h2>
        </div>
      </div>


    </header>
  )
}

export default Header
