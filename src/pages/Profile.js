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
  const [createdURLs, setCreatedURLs] = useState([]);
  const [joinedURLs, setJoinedURLs] = useState([]);
  const [amount, setAmount] = useState(0);
  const [discussionGroupURLs, setDiscussonGroupURLs] = useState([]);
  const [discussionInfos, setDiscussionInfos] = useState([]);

  // Get picture
  const getStorage = async (groupArray, code) => {
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
    switch (code) {
      case 1:
        setCreatedURLs(container);
        break;
      case 2:
        setJoinedURLs(container);
        break;
      case 3:
        setDiscussonGroupURLs(container);
        break;
      default:
        console.log('Can not get pictures');
    }
  };

  // Get info
  const getInfo = async() => {
    let groupArray;
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
      // Get created groups
      groupArray = info.created_groups;      
    } catch (error) {
      console.log(error);
    }
    // Get created groups URL
    if(groupArray) await getStorage(groupArray, 1);
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

  // Get joined groups
  const getJoined = async (doc) => {
    let groupArray = [];
    try {
      await doc
      .ref
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
    await getStorage(groupArray, 2);
  };

  // Get discussions info
  const getDiscussions = async (doc) => {
    let groupArray = [];
    let container = [];
    let amount = 0;
    try {
      await doc
      .ref
      .collection('created-discussions')
      .get()
      .then((querySnapshot) => {
        amount = querySnapshot.size;
        querySnapshot.forEach((doc) => {
          let info = {
            groupName: doc.data().group_name,
            uid: doc.data().discussion_uid,
            title: doc.data().title
          };
          groupArray.push(doc.data().group_name);
          container.push(info);
        });
      });  
  } catch (error) {
    console.log(error);
  }   
  setDiscussionInfos(container);
  await getStorage(groupArray, 3);
  return amount;
  };

  // Get subdiscussions info
  const getSub = async (doc) => {
    let amount = 0;
    try {
      await doc
      .ref
      .collection('created-subdiscussions')
      .get()
      .then((querySnapshot) => {
        amount = querySnapshot.size;
      });  
  } catch (error) {
    console.log(error);
  }   
  return amount;
  };

  // Get data
  const getData = async () => {
    let sum = 0;
    try {
      let userDoc = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();

      await getJoined(userDoc);
      sum = await getDiscussions(userDoc);
      sum += await getSub(userDoc);

      setAmount(sum);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data from Firestore and Firestorage
  const fetchData = async () => {
    await getInfo();
    await getIcon();
    await getData();
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
                <ShowStatistic createdURLs={createdURLs} joinedURLs={joinedURLs} amount={amount} />
              </div>

              <div className='registration'>
                <DeleteUser uid = {uid} />
                <ChangePassword uid = {uid} />
              </div>
            </div>

            <div className='lower-profile'>
              <Titles discussionGroupURLs={discussionGroupURLs} discussionInfos={discussionInfos} />
            </div>
          </div>
      }
    </section>
  );
};

export default Profile;
