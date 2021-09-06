import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { DateTime, Interval } from "luxon";
import Default from '../../assets/img/default-icon.jpg';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const DiscussionsList = (props) => {
  const { documents, selectedGroups } = props;
  const [listTags, setListTags] = useState([]);

  // Get creator icon
  async function getIcon(uid) {
    let iconURL = Default;
    try {
      iconURL =
        await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error.code);
    }
    return iconURL;
  }

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

  // Make one list HTML tag
  const makeList = (uid, iconURL, creator, group, title, subdiscussions, rating, data, index) => {
    let time = calculateTime(data);
    return (
      <li key={index} className='discussion-list'>
      <div className='left-area'>
        <img src={iconURL} alt='icon' width='40px' />
        <h2>{creator}</h2>
      </div>

      <div className='middle-area'>
        <div className='upper-bar'>
          <h2>{group}</h2>
          <h1>{title}</h1>
        </div>

        <div className='lower-bar'>
          <div className="amount">
            <p>{subdiscussions}</p>
            <FontAwesomeIcon icon={faComments} color='' size='lg' />
          </div>
          <p>{rating}</p>
          <p>{time}</p>
        </div>
      </div>

      <div className='right-area'>
        <Link to={'/discussions/' + group + '/' +uid}>Entry</Link>
      </div>
    </li>
    );
  };

  const createList = async () => {
    let container = [];
    if(documents.length === 0) return;

    for (const [index, doc] of documents.entries()) {
      let data = doc.data();
      let discussion_uid = doc.id;
      let group_name = data.group;
      if (!selectedGroups.some((groupName) => groupName === group_name) && selectedGroups.length !== 0) continue;
      let creator_name = data.creator_name;
      let creator_uid = data.creator_uid;
      let iconURL = await getIcon(creator_uid);
      let title = data.title;
      let subdiscussions = data.subdiscussions;
      let rating = (data.rating_up - data.rating_down);
      let list =  makeList(discussion_uid, iconURL, creator_name, group_name, title, subdiscussions, rating, data, index);
      container.push(list);
    }
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, [documents, selectedGroups]);

  return (
    <div className='discussions-list'>
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

export default DiscussionsList;