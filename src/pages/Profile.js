import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import Default from '../assets/img/default-icon.jpg';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
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
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [nation, setNation] = useState('');
  const [iconURL, setIconURL] = useState('');
  const [iconError, setIconError] = useState([]);
  const [pageLoading, setPageLoading] = useState('');
  const [containerClass, setContainerClass] = useState('hidden');

  const toggleLoading = () => {
    if (pageLoading === '') {
      setPageLoading('hidden');
      setContainerClass('profile-container');  
    } else {
      setPageLoading('');
      setContainerClass('hidden');  
    }
  };

  // get icon
  const getIcon = async () => {
    let icon = Default;
    try {
      icon = 
        await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      setIconError(handleFirebaseError(error));
    }
    setIconURL(icon);
  };

  // get info
  const getInfo = async () => {
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      let info = cache.data();
      setNickname(info.nickname);
      setGender(info.gender);
      setNation(info.nation);  
    } catch (error) {
      alert(error);
    }
  };

  // Fetch data from Firestore and Firestorage
  const fetchData = async () => {
    await getIcon();
    await getInfo();
    toggleLoading();
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
