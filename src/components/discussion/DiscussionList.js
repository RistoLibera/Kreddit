import React, { useState, useEffect} from 'react';
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

const DiscussionList = (props) => {
  const { documents } = props;
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

  // Make one list HTML tag
  const makeList = (iconURL, creator, group, title, subdiscussions, rating, created_time, index) => {
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
          <p>{created_time.toDate().toString()}</p>
        </div>
      </div>

      <div className='right-area'>
        <button>Entry</button>
      </div>
    </li>
    );
  };

  const createList = async () => {
    let container = [];
    if(documents.length === 0) return;

    for (const [index, doc] of documents.entries()) {
      let creator = doc.data().creator_name;
      let uid = doc.data().creator_uid;
      let iconURL = await getIcon(uid);
      let group = doc.data().group;
      let title = doc.data().title;
      let subdiscussions = doc.data().subdiscussions;
      let rating = (doc.data().rating_up - doc.data().rating_down);
      let created_time = doc.data().created_time;
      let list =  makeList(iconURL, creator, group, title, subdiscussions, rating, created_time, index);
      container.push(list);
    }
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, [documents]);

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

export default DiscussionList;