import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import Default from '../assets/img/default-icon.jpg';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
// Components
import handleFirebaseError from '../components/error/FirebaseError';
import ShowIcon from '../components/user/ShowIcon';
import DeleteAccount from '../components/user/DeleteAccount';
import ChangePassword from '../components/user/ChangePassword';
import ShowInfo from '../components/user/ShowInfo';
import '../styles/css/profile.css';

const Profile = () => {
  const { uid }  = useParams();
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const history = useHistory();
  let info;
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [nation, setNation] = useState('');
  const [iconURL, setIconURL] = useState('');
  const [iconError, setIconError] = useState([]);
  const [pageLoading, setPageLoading] = useState('');
  const [containerClass, setContainerClass] = useState('hidden');

  // Fetch data from Firestore and Firestorage
  const fetchData = async () => {
    let imgURL = Default;

    try {
      imgURL = 
        await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      setIconError(handleFirebaseError(error));
    }

    setIconURL(imgURL);

    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      info = cache.data();
    } catch (error) {
      alert(error);
    }
    
    if (!info) {
      history.push('/');
    } else {
      setNickname(info.nickname);
      setGender(info.gender);
      setNation(info.nation);  
    }

    // Stop loading
    setContainerClass('profile-container');
    setPageLoading('hidden');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className='profile-page'>
      <div className={pageLoading}>
        <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
      </div>

      <div className={containerClass}>
        <div className='upper-profile'>
          <ShowIcon uid = {uid} iconURL={iconURL} iconError={iconError} />

          <div className='info'>
            <ShowInfo nickname={nickname} gender={gender} nation={nation} />
            <div className='lower-info'>
              <h3>Creator of group</h3>
              <h3>in what groups</h3>
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
      </div>
    </section>
  );
};

export default Profile;
