import React, { useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { DateTime, Interval } from "luxon";
import { useTranslation } from "react-i18next";
import DefaultIcon from '../../assets/img/default-icon.jpg';
import DefaultImg from '../../assets/img/default-image.jpg';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import ClockLoader from 'react-spinners/ClockLoader';

const DiscussionsList = (props) => {
  const { t } = useTranslation('discussion');
  const history = useHistory();
  const { documents, selectedGroups } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [listTags, setListTags] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Open or close a block
  const activate = (event) => {
    const card = event.target.closest('.card');
    const content = card.querySelector('.content');
    card.classList.toggle('open');
    content.classList.toggle('open');
  };

  // Fetch title content img
  const getImg = async (title) => {
    let imgURL = DefaultImg;
    try {
      imgURL = 
        await FirebasePack
          .storage()
          .ref('discussion-title-image/' + title + '/img.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    return imgURL;
  };

  // Get creator icon
  const getIcon = async (uid) => {
    let iconURL = DefaultIcon;
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
  };

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
      <li key={index} className='card flex-row' onClick={activate}>
        <span className='title-img' style={{ backgroundImage: `url('${imgURL}')` }} ></span>
        <div className='flex-column info'>
          <h1 className='title'>{title}</h1>
          <div className="created-by">
            <span className='icon' style={{ backgroundImage: `url('${iconURL}')` }} ></span>
            <h2 className='creator'>{creator}</h2>
          </div>
          <div className="bottom content">
            <p>{content}</p>
          </div>
        </div>

        <div className='flex-column statistics'>
          <div className='group-name'>
            <h2>Group: {group}</h2>
          </div>
          <div className='entry'>
            <button className='simple'onClick={() => history.push('/discussions/' + group + '/' + uid)} >
              {t('content.entry')}
            </button>
          </div>

          <div className='trend'>
            <div className="amount">
              <p>{subdiscussions}</p>
              <FontAwesomeIcon icon={faComments} color='' size='lg' />
            </div>

            <div className='rating'>
              <p>{rating}</p>
              <FontAwesomeIcon icon={faStarHalfAlt} color='' size='lg' />
            </div>

            <div className="time">
              <p>{time}</p>
            </div>
          </div>

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
      // For Filterbuttons component
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
    setPageLoading(false);
  };

  useEffect(() => {
    createList();
  }, [documents, selectedGroups]);

  return (
    <div className='discussions-list'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClockLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
          <ul className='center list flex-column'>
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

export default DiscussionsList;