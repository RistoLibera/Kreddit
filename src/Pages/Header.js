import React from 'react';
import Koin from '../assets/Header-Koin.png';
import '../styles/css/header.css';

const Header = () => {


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
        <div className="user-bar">
        {/* <div>
          <h2>notification</h2>
        </div> */}
        <div>
          <h2>Login</h2>
        </div>
        {/* <div>
          <h2>setting</h2>
        </div> */}
        <div>
          <h2>Signup</h2>
        </div>
      </div>
        <div>
          <h2>mode</h2>
        </div>
      </div>


    </header>
  )
}

export default Header
