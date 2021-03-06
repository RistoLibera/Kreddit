import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import FirebasePack from '../config/FirebasePack';
import Default from '../assets/img/default-icon.jpg';
import Koin from '../assets/img/header-koin.png';
import SearchBar from '../components/search/SearchBar';
import ShowNotif from '../components/notification/ShowNotif';
import Language from '../components/user/Language';
import Signout from '../components/user/Signout';
import DisplayMode from '../components/user/DisplayMode';
import '../styles/css/header.css';

const Header = () => {
  const { t } = useTranslation('header');
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  const [iconURL, setIconURL] = useState('');
  const [notifDocs, setNotifDocs] = useState([]);
  const [showMenu, setShowMenu] = useState('hidden');
  const [name, setName] = useState('');

  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!currentUser) return;
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
    return icon;
  };

  // Get notification
  const getNotif = async () => {
    let docs = [];
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(currentUser.uid)
        .collection('notifications')
        .orderBy("created_time", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            docs.push(doc);
          });
        });
    } catch (error) {
      console.log(error);
    }
    return docs;
  };

  const getData =  async () => {
    if (currentUser) {
      let name = (currentUser.email).slice(0, -9);
      setName(name);
      let url = await getIcon();
      let docs = await getNotif();
      setIconURL(url);
      setNotifDocs(docs);
    }
  };

  useEffect(() => {
    getData();
  }, [currentUser]);

  return (
    <header className='app-header'>
      <div className='left-bar'>
        <SearchBar />
      </div>

      <div className='middle-bar'>
        <div onClick={() => history.push('/discussions/00')} className='discussions-bar'>
          <h2>{t('content.discussion')}</h2>
        </div>
        <div id='icon' onClick={() => history.push('/')} >
          <img src={Koin} alt='Koin'></img>
        </div>
        <div onClick={() => history.push('/groups')} className='groups-bar'>
          <h2>{t('content.group')}</h2>
        </div>
      </div>

      <div className='right-bar'>
        {currentUser
          ?
            <div className='user-bar'>
              <ShowNotif documents={notifDocs} currentUser={currentUser} update={getData} />
              <div className="dropdown">
                <div id="megatron" onClick={()=> getData()} style={{ display: 'none'}} ></div>
                <button onClick={togglebutton} className="dropbtn" style={{ backgroundImage: `url('${iconURL}')` }}></button>
                <div id="dropdown-menu" className={showMenu}>
                  <h3>{name}</h3>
                  <Link className="dropdown-items" to={getProfileURL}>{t('content.profile')}</Link>
                  <Language />
                  <Signout />
                </div>
              </div>
            </div>
          :
            <div className='user-bar'>
              <div className='gain-access'>
                <button onClick={() => history.push('/login')} type='button'>
                  {t('content.login')}
                </button>
              </div>
              <div className='gain-access'>
                <button onClick={() => history.push('/signup')} type='button'>
                  {t('content.signup')}
                </button>
              </div>
            </div>
          }
        <DisplayMode />
      </div>
    </header>
  );
};

export default Header;
