import React, { useState, useEffect} from 'react';
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';

const DiscussionList = (props) => {
  const { documents, user } = props;
  const [listTags, setListTags] = useState([]);







  return (
    <div className='discussions-list'>
      <ul>
        <li>
          <div className='left-area'>
            <h1>Icon</h1>
            <h2>Host</h2>
          </div>

          <div className='middle-area'>
            <div className='upper-bar'>
              <h2>Which group</h2>
              <h1>Title</h1>
            </div>

            <div className='lower-bar'>
              <p>Discussion amount</p>
              <p>Rating</p>
              <p>Published time</p>
            </div>
          </div>

          <div className='right-area'>
            <button>Entry</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DiscussionList;