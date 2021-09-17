import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import DefaultIcon from '../assets/img/default-icon.jpg';
import DefaultSymbol from '../assets/img/default-symbol.png';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import ClockLoader from 'react-spinners/ClockLoader';
import ShowIcon from '../components/user/ShowIcon';
import DeleteUser from '../components/user/DeleteUser';
import ChangePassword from '../components/user/ChangePassword';
import ShowInfo from '../components/user/ShowInfo';
import Titles from '../components/user/Titles';
import ShowStatistic from '../components/user/ShowStatistic';
import '../styles/css/profile.css';
import toast from 'react-hot-toast';

const Profile = () => {
  const { uid }  = useParams();
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  margin: 0 auto;
  border-color: red;
  `;
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [nation, setNation] = useState('');
  const [iconURL, setIconURL] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [createdURLs, setCreatedURLs] = useState([]);
  const [joinedURLs, setJoinedURLs] = useState([]);
  const [amount, setAmount] = useState(0);
  const [discussionGroupURLs, setDiscussonGroupURLs] = useState([]);
  const [discussionInfos, setDiscussionInfos] = useState([]);

  // Get icon
  const getIcon = async () => {
    let icon = DefaultIcon;
    try {
      icon = 
        await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    setIconURL(icon);
  };

  // Get group symbol
  const getSymbol = async (groupArray, code) => {
    let container = [];
    for (const groupName of groupArray) {
      let url = DefaultSymbol;
      try {
        url = 
          await FirebasePack
            .storage()
            .ref('group-symbol/' + groupName + '/symbol.jpg')
            .getDownloadURL();
        container.push(url);
      } catch (error) {
        console.log(error);
        container.push(url);
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

  // Corner notification block
  const warningNotif = () => {
    toast((t) => (
      <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faExclamationCircle} color='#CCCC00' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>Non-existence!</span>
      </span>
    ));
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
        warningNotif();
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
    if(groupArray) await getSymbol(groupArray, 1);
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
    await getSymbol(groupArray, 2);
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
  await getSymbol(groupArray, 3);
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

  // Get discussion data
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
            <ClockLoader color='#8E5829' css={spinnerCSS} size={100} />
          </div>
        :
          <div className='profile-container'>
            <div className='upper-profile'>
              <ShowIcon uid = {uid} iconURL={iconURL} update={getIcon} />

              <div className='info'>
                <ShowInfo nickname={nickname} gender={gender} nation={nation} />
                <ShowStatistic createdURLs={createdURLs} joinedURLs={joinedURLs} amount={amount} />
              </div>

              <div className='registration'>
                <ChangePassword uid = {uid} />
                <DeleteUser uid = {uid} />
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
