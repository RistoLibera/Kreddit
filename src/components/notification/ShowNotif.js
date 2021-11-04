import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { faBellSlash as farBellSlash } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const ShowNotif = (props) => {
  const { t } = useTranslation('header');
  const { documents, currentUser, update } = props;
  const [listTags, setListTags] = useState([]);
  const [showUL, setShowUL] = useState('hidden');

  // Corner notification block
  const successNotif = () => {
    toast((e) => (
      <span onClick={() => toast.dismiss(e.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faCheckCircle} color='green' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{t('content.success')}</span>
      </span>
    ));
  };
    
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
    successNotif();
    update();
  };

  // Make one list HTML tag
  const makeNotifList = (rate, reply, sender, url , index) => {
    if (rate === true && reply === true) {
      return (
        <li key={index}>
          <Link to={url}>{sender} {t('content.partake')}</Link>
        </li>
      );
    } else if (rate === true) {
      return (
        <li key={index}>
          <Link to={url}>{sender} {t('content.rate')}</Link>
        </li>
      );
    } else {
      return (
        <li key={index}>
          <Link to={url}>{sender} {t('content.reply')}</Link>
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
    let clearOption = <li id='clear-all' key={container.length} onClick={clearNotif}><span>{t('content.clear')}</span></li>;
    container.push(clearOption);
    container.reverse();
    setListTags(container);
  };

  // For smartphone responsiveness
  const toggleShowOnSmartphone = () => {
    if (showUL === 'hidden') {
      setShowUL('show');
    } else {
      setShowUL('hidden');
    }
  };
  
  useEffect(() => {
    createNotif();
  }, [documents, t]);

  return (
    <div className='notification-center' onMouseEnter={() => setShowUL('show')} onMouseLeave={() => setShowUL('hidden')} onClick={() => toggleShowOnSmartphone()} >
      {documents.length === 0
        ?
          <FontAwesomeIcon icon={farBellSlash} color='' size='2x' />
        :
          <FontAwesomeIcon icon={farBell} color='' size='2x' />
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
