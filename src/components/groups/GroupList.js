import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { DateTime, Interval } from "luxon";
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

const GroupList = (props) => {
  const { t } = useTranslation('group');
  const history = useHistory();
  const { documents, currentUser, update } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [listTags, setListTags] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Check current user enrollment
  const checkGroup = async (name, user) => {
    if (!user) return;
    let buttonState = false;
    let groupNames = [];
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(user.uid)
        .collection('joined-groups')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            groupNames.push(doc.data().group_name);
          });
        });
      if (groupNames) {
        buttonState = groupNames.some((groupName) => groupName === name);
      }
    } catch (error) {
      console.log(error);
    }
    return buttonState;
  };
  
  //  Join group
  const joinGroup = async (groupName, groupUID, user) => {
    if (!user) {
      alert('Please log in!');
      return;
    }
    
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(user.uid)
        .collection('joined-groups')
        .doc(groupName)
        .set({
          group_name: groupName,
          group_uid: groupUID
        });
      alert('success!');
    } catch (error) {
      console.log(error);
    }
    update();
  };
  
  // Calculate when was the group created
  const calculateTime = (data) => {
    let time;
    let now = DateTime.now();
    let createdTime = DateTime.fromSeconds(data.created_time.seconds);
    let interval = Interval.fromDateTimes(createdTime, now);
    if (interval.length('years') > 1) {
      let grammar = interval.length('years') >= 2 ? 'years ago' : 'year ago';
      time = (Math.floor(interval.length('years')) + grammar);
    } else if (interval.length('months') > 1) {
      let grammar = interval.length('months') >= 2 ? 'months ago' : 'month ago';
      time = (Math.floor(interval.length('months')) + grammar);
    } else if (interval.length('days') > 1) {
      let grammar = interval.length('days') >= 2 ? 'days ago' : 'day ago';
      time = (Math.floor(interval.length('days')) + grammar);
    } else if (interval.length('hours') > 1) {
      let grammar = interval.length('hours') >= 2 ? 'hours ago' : 'hour ago';
      time = (Math.floor(interval.length('hours')) + grammar);
    } else if (interval.length('minutes') > 1) {
      let grammar = interval.length('minutes') >= 2 ? 'minutes ago' : 'minute ago';
      time = (Math.floor(interval.length('minutes')) + grammar);
    } else {
      let grammar = interval.length('seconds') >= 2 ? 'seconds ago' : 'second ago';
      time = (Math.floor(interval.length('seconds')) + grammar);
    }
    return time;
  };  

  // Get group symbol
  const getSymbol = async (name) => {
    let symbolURL = Default;
    try {
      symbolURL =
        await FirebasePack
          .storage()
          .ref('group-symbol/' + name + '/symbol.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    return symbolURL;
  };

  // Make one list HTML tag
  const makeList = (groupName, groupUID, creator, introduction, time, symbolURL, index, buttonState) => {
    return (
      <li key={index} className='group-list'>
        <div className='left-block'>
          <img src={symbolURL} alt='icon' width='40px' />
          <h2>{groupName}</h2>
        </div>

        <div className='middle-block'>
          <p>{t('content.creator')}: {creator}</p>
          <p>{introduction}</p>
          <p>{time}</p>
        </div>

        <div className='right-block'>
          {currentUser 
            ? 
              <button onClick={() => joinGroup(groupName, groupUID, currentUser)} disabled={buttonState}>{t('content.join')}</button>
            :
              <button>Join</button>
          }
          <button onClick={() => history.push('/discussions/' + groupName)} >should be a icon</button>
        </div>
      </li>
    );
  };
    
  const createList = async () => {
    let container = [];
    if(documents.length === 0) return;

    for (const [index, doc] of documents.entries()) {
      let groupUID = doc.id;
      let data = doc.data();
      let creator = data.creator;
      let groupName = data.name;
      let introduction = data.introduction;
      let time = calculateTime(data);
      let symbolURL = await getSymbol(groupName);
      let buttonState = await checkGroup(groupName, currentUser);
      let list =  makeList(groupName, groupUID, creator, introduction, time, symbolURL, index, buttonState);
      container.push(list);
    }
    setListTags(container);
    setPageLoading(false);
  };

  useEffect(() => {
    createList();
  }, [documents, t]);

  return (
    <div className='all-groups'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
          <ul>
            {listTags.map((li) => {
              return (
                li
              );
            })}
          </ul>
      }
    </div>
  );
};

export default GroupList;