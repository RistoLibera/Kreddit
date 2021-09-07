import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import Default from '../assets/img/default-icon.jpg';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import handleFirebaseError from '../components/error/handleFirebaseError';
import ShowIcon from '../components/user/ShowIcon';
import DeleteUser from '../components/user/DeleteUser';
import ChangePassword from '../components/user/ChangePassword';
import ShowInfo from '../components/user/ShowInfo';
import Titles from '../components/user/Titles';
import ShowStatistic from '../components/user/ShowStatistic';
import '../styles/css/profile.css';

const Profile = () => {
  const { uid }  = useParams();
  const history = useHistory();
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
  const [pageLoading, setPageLoading] = useState(true);
  const [createdGroups, setCreatedGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [amount, setAmount] = useState(0);

  // Get info
  const getInfo = async() => {
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      let info = cache.data();
      if(!info) {
        alert('Non-existence');
        history.push('/');
      }
      setNickname(info.nickname);
      setGender(info.gender);
      setNation(info.nation);  
    } catch (error) {
      console.log(error);
    }
  };

  // Get icon
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

  // Get created symbol
  const getCreatedSymbol = async (groupArray) => {
    let container = [];
    for (const groupName of groupArray) {
      try {
        let url = 
          await FirebasePack
            .storage()
            .ref('group-symbol/' + groupName + '/symbol.jpg')
            .getDownloadURL();
        container.push(url);
      } catch (error) {
        console.log(error);
      }
    }
    setCreatedGroups(container);
  };

  // Get created groups
  const getCreated = async () => {
    let groupArray = [];
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      let info = cache.data();
      if(info) {
        groupArray = info.created_groups;
      }
    } catch (error) {
      console.log(error);
    }
    await getCreatedSymbol(groupArray);
  };

  // Get joined symbol
  const getJoinedSymbol = async (groupArray) => {
    let container = [];
    for (const groupName of groupArray) {
      try {
        let url = 
          await FirebasePack
            .storage()
            .ref('group-symbol/' + groupName + '/symbol.jpg')
            .getDownloadURL();
        container.push(url);
      } catch (error) {
        console.log(error);
      }
    }
    setJoinedGroups(container);
  };

  // Get joined groups
  const getJoined = async () => {
    let groupArray = [];
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .collection('joined-groups')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let groupName = doc.data().group_name;
            groupArray.push(groupName);
          });
        });  
    } catch (error) {
      console.log(error);
    }
    await getJoinedSymbol(groupArray);
  };

  // Get posted amount
  const getDiscussionAmount = async () => {
    let amount = 0;
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .collection('created-discussions')
        .get()
        .then((querySnapshot) => {
          amount = querySnapshot.size;
        });  
    } catch (error) {
      console.log(error);
    }

    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .collection('created-subdiscussions')
        .get()
        .then((querySnapshot) => {
          amount += querySnapshot.size;
        });  
    } catch (error) {
      console.log(error);
    }
    setAmount(amount);
  };

  // Fetch data from Firestore and Firestorage
  const fetchData = async () => {
    await getInfo();
    await getIcon();
    await getCreated();
    await getJoined();
    await getDiscussionAmount();
    setPageLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className='profile-page'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <div className='profile-container'>
            <div className='upper-profile'>
              <ShowIcon uid = {uid} iconURL={iconURL} iconError={iconError} update={getIcon} />

              <div className='info'>
                <ShowInfo nickname={nickname} gender={gender} nation={nation} />
                <ShowStatistic createdGroups={createdGroups} joinedGroups={joinedGroups} amount={amount} />
              </div>

              <div className='registration'>
                <DeleteUser uid = {uid} />
                <ChangePassword uid = {uid} />
              </div>
            </div>

            <div className='lower-profile'>
              <Titles />
            </div>
          </div>
      }
    </section>
  );
};

export default Profile;
