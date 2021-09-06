import React, { useState, useEffect} from 'react';
import { DateTime, Interval } from "luxon";
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';

const GroupList = (props) => {
  const { documents, user } = props;
  const [listTags, setListTags] = useState([]);

  // Check current user enrollment
  const checkGroup = async (name, user) => {
    let buttonState = false;
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(user.uid)
          .get();
      let info = cache.data().joined_groups;
      if (info) {
        buttonState = info.some((groupName) => groupName === name);
      }
    } catch (error) {
      console.log(error);
    }
    return buttonState;
  };
  
  //  Join group
  const joinGroup = async (groupName, user) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(user.uid)
        .update({
          joined_groups: firebase.firestore.FieldValue.arrayUnion(groupName)
        });
      alert('success!');
    } catch (error) {
      console.log(error);
    }
  };
  
  // Calculate when was the discussion created
  const calculateTime = (data) => {
    let time;
    let now = DateTime.now();
    let createdTime = DateTime.fromSeconds(data.created_time.seconds);
    let interval = Interval.fromDateTimes(createdTime, now);
    if (interval.length('years') > 1) {
      time = (Math.floor(interval.length('years')) + 'Y ago');
    } else if (interval.length('months') > 1) {
      time = (Math.floor(interval.length('months')) + 'M ago');
    } else if (interval.length('days') > 1) {
      time = (Math.floor(interval.length('days')) + 'D ago');
    } else if (interval.length('hours') > 1) {
      time = (Math.floor(interval.length('hours')) + 'H ago');
    } else if (interval.length('minutes') > 1) {
      time = (Math.floor(interval.length('minutes')) + 'M ago');
    } else {
      time = (Math.floor(interval.length('seconds')) + 'S ago');
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
  const makeList = (name, creator, introduction, time, symbolURL, index, buttonState) => {
    return (
      <li key={index} className='group-list'>
        <div className='left-block'>
          <img src={symbolURL} alt='icon' width='40px' />
          <h2>{name}</h2>
        </div>

        <div className='middle-block'>
          <p>Creator: {creator}</p>
          <p>{introduction}</p>
          <p>{time}</p>
        </div>

        <div className='right-block'>
          <button onClick={() => joinGroup(name, user)} disabled={buttonState}>Join</button>
          <button>To discussion by auto select group button</button>
        </div>
      </li>
    );
  };
    
  const createList = async () => {
    let container = [];
    if(documents.length === 0) return;

    for (const [index, doc] of documents.entries()) {
      let data = doc.data();
      let creator = data.creator;
      let name = data.name;
      let introduction = data.introduction;
      let time = calculateTime(data);
      let symbolURL = await getSymbol(name);
      let buttonState = await checkGroup(name, user);
      let list =  makeList(name, creator, introduction, time, symbolURL, index, buttonState);
      container.push(list);
    }
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, [documents]);

  return (
    <div className='all-groups'>
      <ul>
        {listTags.map((li) => {
          return (
            li
          );
        })}
      </ul>
    </div>
  );
};

export default GroupList;