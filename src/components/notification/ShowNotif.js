import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBellSlash } from '@fortawesome/free-solid-svg-icons';

const ShowNotif = (props) => {
  const { documents, currentUser, update } = props;
  const [listTags, setListTags] = useState([]);
  const [showUL, setShowUL] = useState('hidden');

  // Clear all notifications
  const clearNotif = async () => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(currentUser.uid)
        .collection('notifications')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
    } catch (error) {
      console.log(error);
    }
    setListTags([]);
    alert('success');
    update();
  };

  // Make one list HTML tag
  const makeNotifList = (rate, reply, sender, url , index) => {
    if (rate === true && reply === true) {
      return (
        <li key={index}>
          <Link to={url}>{sender} partook in your discussion</Link>
        </li>
      );
    } else if (rate === true) {
      return (
        <li key={index}>
          <Link to={url}>{sender} rate your discussion</Link>
        </li>
      );
    } else {
      return (
        <li key={index}>
          <Link to={url}>{sender} reply to your discussion</Link>
        </li>
      );
    }
  };
  
  const createNotif = () => {
    let container = [];
    if(documents.length === 0) return;

    for (const [index, doc] of documents.entries()) {
      let list;
      let data = doc.data();
      let rate = data.rate;
      let reply = data.reply;
      let sender = data.sender;
      let url = data.url;
      list = makeNotifList(rate, reply, sender, url , index);
      container.push(list);
    }
    let clearOption = <li id='clear-all' key={container.length} onClick={clearNotif}>Clear all</li>;
    container.push(clearOption);
    container.reverse();
    setListTags(container);
  };
  
  useEffect(() => {
    createNotif();
  }, [documents]);

  return (
    <div className='notification-center' onMouseEnter={() => setShowUL('show')} onMouseLeave={() => setShowUL('hidden')}>
      {documents.length === 0
        ?
          <FontAwesomeIcon icon={faBellSlash} color='' size='2x' />
        :
          <FontAwesomeIcon icon={faBell} color='' size='2x' />
      }
      <ul className={showUL}>
        {listTags.map((li) => {
            return (
              li
            );
        })}
      </ul>
    </div>
  );
};

export default ShowNotif;
