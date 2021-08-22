import React from 'react';
import '../styles/css/profile.css';

const Profile = () => {


  return (
    <section id="profile">
      <div className="upper-profile">
        <div>
          <h1>icon</h1>
        </div>
        <div>
          <h2>nickname</h2>
          <h2>gender</h2>
          <h3>Belong to what group</h3>
          <h3>discussion number</h3>
        </div>
      </div>
      <div className="lower-profile">
        <h3>Your discussions</h3>
      </div>

    </section>
  )
}

export default Profile
