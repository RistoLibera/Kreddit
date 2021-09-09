import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ShowNotif = (props) => {
  const { documents } = props;
  const [listTags, setListTags] = useState([]);

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
    setListTags(container);
  };
  
  useEffect(() => {
    createNotif();
  }, [documents]);

  return (
    <div className='notification-center'>
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

export default ShowNotif;
