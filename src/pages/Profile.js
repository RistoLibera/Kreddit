import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShowIcon from '../components/user/ShowIcon';
import DeleteAccount from '../components/user/DeleteAccount';
import ChangePassword from '../components/user/ChangePassword';
import ShowInfo from '../components/user/ShowInfo';
import '../styles/css/profile.css';

const Profile = () => {
  // Use complex user UID to avoid malice
  const { uid }  = useParams();

  // Data structure
  // groups - Anime -         content             - discussions - 0  1  2 - discussion - 0    1   2   3     - subdis - 0   1   2   3  
  //                -  creator icon introduction  -            -  title  -             - content uid rating -        - content uid rating
  
  // user-info                                -  notif - 0 
  // created-groups   created-discussion      -        - from: uid  content: what to do?

  return (
    <section className='profile-page'>
        <div className='upper-profile'>
          <ShowIcon uid = {uid} />

          <div className='info'>
            <ShowInfo uid = {uid} />
            <div className='lower-info'>
              <h3>what groups</h3>
              <h3>discussion number</h3>
            </div>
          </div>

          <div className='registration'>
            <DeleteAccount uid = {uid} />
            <ChangePassword uid = {uid} />
          </div>
        </div>

        <div className='lower-profile'>
          <h3>Your discussions</h3>
          <h5>Expand all</h5>
        </div>
    </section>
  );
};

export default Profile;
