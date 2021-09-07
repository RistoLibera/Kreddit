import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import { DateTime, Interval } from "luxon";
import FirebasePack from '../../config/FirebasePack';
import DefaultIcon from '../../assets/img/default-icon.jpg';
import DefaultSymbol from '../../assets/img/default-symbol.png';
import ReplyForm from './ReplyForm';
import EditForm from './EditForm';
import Delete from './Delete';
import RatingButtons from './RatingButtons';
import SubDiscussionBody from './SubDiscussionBody';

const DiscussionBody = (props) => {
  const { currentUser } = useContext(AuthContext);
  const { groupUID, document, rootUpdate } = props;
  const [editShow, setEditShow] = useState(false);
  const [formHidden, setFormHidden] = useState('hidden');
  const [group, setGroup] = useState('');
  const [symbolURL, setSymbolURL] = useState('');
  const [iconURL, setIconURL] = useState('');
  const [title, setTitle] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [creator, setCreator] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };
  
  // Toggle edit form
  const toggleEdit = () => {
    setEditShow(!editShow);
  };

  // Calculate when was the discussion created
  const calculateTime = (data) => {
    let now = DateTime.now();
    let createdTime = DateTime.fromSeconds(data.created_time.seconds);
    let interval = Interval.fromDateTimes(createdTime, now);
    if (interval.length('years') > 1) {
      setTime(Math.floor(interval.length('years')) + 'Y ago');
    } else if (interval.length('months') > 1) {
      setTime(Math.floor(interval.length('months')) + 'M ago');
    } else if (interval.length('days') > 1) {
      setTime(Math.floor(interval.length('days')) + 'D ago');
    } else if (interval.length('hours') > 1) {
      setTime(Math.floor(interval.length('hours')) + 'H ago');
    } else if (interval.length('minutes') > 1) {
      setTime(Math.floor(interval.length('minutes')) + 'M ago');
    } else {
      setTime(Math.floor(interval.length('seconds')) + 'S ago');
    }
  };

  // Get group symbol
  const getSymbol = async (group) => {
    let URL = DefaultSymbol;
    try {
      URL =
        await FirebasePack
          .storage()
          .ref('group-symbol/' + group + '/symbol.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    setSymbolURL(URL);
  };

  // Fetch creator icon
  const getIcon = async (uid) => {
    let URL = DefaultIcon;
    try {
      URL = 
        await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    setIconURL(URL);
  };

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
    setImgURL(URL);
  };
  
  const fetchTitleContent = async () => {
    let data = document.data();
    calculateTime(data);
    await getIcon(data.creator_uid);
    await getImg(data.title);
    await getSymbol(data.group_name);
    setTitle(data.title);
    setCreator(data.creator_name); 
    setContent(data.content);
    setGroup(data.group);
    setRating(data.rating_up.length - data.rating_down.length);
  };

  useEffect(() => {
    fetchTitleContent();
  }, [document]);

  return (
    <div className='discussion-content'>
      <div className='discussion-container'>
        <div className='group'>
          <img src={symbolURL} alt='symbol' width='40px' height='40px'/>
          <h2>{group}</h2>
        </div>
        
        <div className='title'>
          <RatingButtons rating={rating} currentUser={currentUser} groupUID={groupUID} id={document.id} document={document} rootUpdate={rootUpdate}/>

          <div className='title-body'>
            <header className='body-header'>
              <img src={iconURL} alt='icon' width='30px' height='30px'/>
              <h1>{creator}</h1>
              <h1>{title}</h1>
              <h1>{time}</h1>
            </header>

            <div className='title-content'>
              <img src={imgURL} alt='img' width='70px' />
              {editShow
                ?
                  <EditForm groupUID={groupUID} content={content} title={title} id={document.id} rootUpdate={rootUpdate} toggleEdit={toggleEdit} />
                :
                <h2>{content}</h2>
              }
            </div>

            <div className='title-buttons'>
              {currentUser
                ?
                  <div className='interaction'>
                    <div className='reply-block'>
                      <button onClick={switchHidden}>Reply</button>
                    </div>
                    {currentUser.uid === document.data().creator_uid
                      ?
                        <div className='current-interaction'>
                          <button onClick={toggleEdit}>Edit</button>
                          <Delete groupUID={groupUID} id={document.id} currentUser={currentUser} />
                        </div>
                      :
                        <div></div>
                    }
                  </div>
                :
                  <div className='warning'>
                    <p>Log in to see more content</p>
                  </div>
              }
            </div>
          </div>
        </div>
        <ReplyForm user={currentUser} hidden={formHidden} rootUpdate={rootUpdate}/>
        <SubDiscussionBody />
      </div>
    </div>
  );
};

export default DiscussionBody;