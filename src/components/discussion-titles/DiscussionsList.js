import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { DateTime, Interval } from "luxon";
import Default from '../../assets/img/default-icon.jpg';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

const DiscussionsList = (props) => {
  const history = useHistory();
  const { documents, selectedGroups } = props;
  const [listTags, setListTags] = useState([]);

  // Fetch title content img
  const getImg = async (title) => {
    let URL;
    try {
      URL = 
        await FirebasePack
          .storage()
          .ref('discussion-title-image/' + title + '/img.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    return URL;
  };

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

  // Make one list HTML tag
  const makeList = (uid, iconURL, creator, group, title, content, imgURL, subdiscussions, rating, time, index) => {
    return (
      <li key={index} className='discussion-list' onClick={() => history.push('/discussions/' + group + '/' + uid)}>
        <div className='first-area'>
          <div className='creator'>
            <img src={iconURL} alt='icon' width='40px' />
            <h2>{creator}</h2>
          </div>

          <div className='group'>
            <h2>{group}</h2>
            <h1>{title}</h1>
          </div>
        </div>

        <div className='second-area'>
          <img src={imgURL} alt='img' width='100px' />
          <p>{content}</p>
        </div>

        <div className='third-area'>
          <div className="amount">
            <p>{subdiscussions}</p>
            <FontAwesomeIcon icon={faComments} color='' size='lg' />
          </div>

          <div className='rating'>
            <p>{rating}</p>
            <FontAwesomeIcon icon={faStarHalfAlt} color='' size='lg' />
          </div>

          <p>{time}</p>
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
      let group_name = data.group_name;
      if (!selectedGroups.some((groupName) => groupName === group_name) && selectedGroups.length !== 0) continue;
      let creator_name = data.creator_name;
      let creator_uid = data.creator_uid;
      let iconURL = await getIcon(creator_uid);
      let title = data.title;
      let content = data.content;
      let imgURL = await getImg(title);
      let subdiscussions = data.subdiscussions;
      let rating = (data.rating_up.length - data.rating_down.length);
      let time = calculateTime(data);
      let list =  makeList(discussion_uid, iconURL, creator_name, group_name, title, content, imgURL, subdiscussions, rating, time, index);
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