import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

const Titles = (props) => {
  const history = useHistory();
  const { discussionGroupURLs, discussionInfos } = props;
  const [listTags, setListTags] = useState([]);

  const makeList = (symbolURL, title, linkURL, index) => {
    return (
      <li key={index}>
        <div className='title'>
          <span className='img'  style={{ backgroundImage: `url('${symbolURL}')` }}></span>
          <h1>{title}</h1>
        </div>

        <div className='entry'>
          <button onClick={() => history.push(linkURL)}>
            <FontAwesomeIcon icon={faDoorOpen} color='' size='2x' />
            <FontAwesomeIcon icon={faDoorClosed} color='' size='2x' />
          </button>
        </div>
      </li>
    );
  };

  const createList = () => {
    let container = [];
    for (let i = 0; i < discussionInfos.length; i++) {
      let symbolURL = discussionGroupURLs[i];
      let title = discussionInfos[i].title;
      let groupName = discussionInfos[i].groupName;
      let discussionURL = discussionInfos[i].uid;
      let linkURL = '/discussions/' + groupName + '/' + discussionURL;
      let list = makeList(symbolURL, title, linkURL, i);
      container.push(list);
    }
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, []);

  return (
    <div className='title-blocks'>
      <ol className="gradient-list">
        {listTags.map((li) => {
          return (
            li
          );
        })}
      </ol>
    </div>
  );
};

export default Titles;