import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Koin from '../assets/Header-Koin.png';
import '../styles/css/header.css';
import Signout from '../components/user/Signout';

const Header = () => {
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  // Change registration interface
  const registrationBar = () => {
    if (currentUser) {
      return (
        // converge into one setting block later
        <div className="user-bar">
          <div>
            <h2>notification</h2>
          </div>
          <div>
          <Link to="./profile">Profile</Link>
          <Signout />
          </div>
        </div>
      )
    } else {
      return (
        <div className="user-bar">
          <div>
            <button onClick={() => history.push("/login")} type="button">
              Log in
            </button>
          </div>
          <div>
            <button onClick={() => history.push("/signup")} type="button">
              Sign up
            </button>
          </div>
        </div>
      )
    };
  };

  return (
    <header id="app-header">
      <div className="left-bar">
        <div id="search-bar">
          {/* Let kreddit! */}
          <h3>Search?</h3>
        </div>
      </div>

      <div className="middle-bar">
        <div>
          <h2>Group</h2>
        </div>
        <div id="icon" onClick={() => history.push("/")}>
          <img src={Koin} alt="Koin"></img>
        </div>
        <div>
          <h2>Discussion</h2>
        </div>

      </div>

      <div className="right-bar">
        {registrationBar()}
        <div className="mode-bar">
          <h2>mode</h2>
        </div>
      </div>
      
    </header>
  )
}

export default Header
