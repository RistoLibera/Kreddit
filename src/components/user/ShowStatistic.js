import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from "react-i18next";
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const ShowStatistic = (props) => {
  const { t } = useTranslation('profile');
  const { createdURLs, joinedURLs, amount } = props;
  const [createdList, setCreatedList] = useState([]);
  const [createdRemnant, setCreatedRemnant] = useState(0);
  const [joinedList, setjoinedList] = useState([]);
  const [joinedRemnant, setjoinedRemnant] = useState(0);

  // Make one list HTML tag
  const makeList = (url, index) => {
    return (
      <li key={index}>
        <img src={url} alt='symbol' width='20px' />
      </li>
    );
  };
  
  const showCreated = () => {
    const length = createdURLs.length;
    if (length === 0) return;
    if (length > 3) setCreatedRemnant(length - 3);
    let iterator = (length < 4 ? length : 3);

    let container = [];
    for (let i = 0; i < iterator; i++) {
      let url = createdURLs[i];
      let list = makeList(url, i);
      container.push(list);
    }
    setCreatedList(container);
  };

  const showJoined = () => {
    const length = joinedURLs.length;
    if (length === 0) return;
    if (length > 3) setjoinedRemnant(length - 3);
    let iterator = (length < 4 ? length : 3);

    let container = [];
    for (let i = 0; i < iterator; i++) {
      let url = joinedURLs[i];
      let list = makeList(url, i);
      container.push(list);
    }
    setjoinedList(container);
  };

  useEffect(() => {
    showCreated();
    showJoined();
  }, []);

  return (
    <div className='lower-info'>
      <div className="groups">
        <div className='as-creator'>
          <h5>{t('content.create')}</h5>
          <ul>
            {createdList.map((li) => {
              return (
                li
              );
            })}
          </ul>
          <span>+{createdRemnant}</span>
        </div>

        <div className='as-member'>
          <h5>{t('content.join')}</h5>
          <ul>
            {joinedList.map((li) => {
              return (
                li
              );
            })}
          </ul>
          <span>+{joinedRemnant}</span>
        </div>
      </div>

      <div className="discussions">
        <div className='as-participant'>
          <FontAwesomeIcon icon={faCommentDots} color='' size='2x' />
          <p>{amount}</p>
        </div>
      </div>
    </div>
  );
};

export default ShowStatistic;