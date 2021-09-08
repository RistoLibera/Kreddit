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
  const { document, rootUpdate } = props;
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
  const [layer, setLayer] = useState(0);
  const [subDocs, setSubDocs] = useState([]);

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
      let grammar = interval.length('years') >= 2 ? 'years ago' : 'year ago';
      setTime(Math.floor(interval.length('years')) + grammar);
    } else if (interval.length('months') > 1) {
      let grammar = interval.length('months') >= 2 ? 'months ago' : 'month ago';
      setTime(Math.floor(interval.length('months')) + grammar);
    } else if (interval.length('days') > 1) {
      let grammar = interval.length('days') >= 2 ? 'days ago' : 'day ago';
      setTime(Math.floor(interval.length('days')) + grammar);
    } else if (interval.length('hours') > 1) {
      let grammar = interval.length('hours') >= 2 ? 'hours ago' : 'hour ago';
      setTime(Math.floor(interval.length('hours')) + grammar);
    } else if (interval.length('minutes') > 1) {
      let grammar = interval.length('minutes') >= 2 ? 'minutes ago' : 'minute ago';
      setTime(Math.floor(interval.length('minutes')) + grammar);
    } else {
      let grammar = interval.length('seconds') >= 2 ? 'seconds ago' : 'second ago';
      setTime(Math.floor(interval.length('seconds')) + grammar);
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
    await getSymbol(data.group_name);
    await getImg(data.title);
    setTitle(data.title);
    setCreator(data.creator_name); 
    setContent(data.content);
    setGroup(data.group_name);
    setRating(data.rating_up.length - data.rating_down.length);
    setLayer(data.layer);
  };

  const fetchSubdiscussionInfos = async () => {
    let container = [];
    try {
      await document
        .ref
        .collection('subdiscussions')
        .orderBy("created_time", "desc")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            container.push(doc);
          });
        });
    } catch (error) {
      console.log(error);
    }
    setSubDocs(container);
  };

  useEffect(() => {
    fetchTitleContent();
    fetchSubdiscussionInfos();
  }, [document]);

  return (
    <div className='discussion-container'>
      <div className='discussion-content'>
        <div className='group'>
          <img src={symbolURL} alt='symbol' width='40px' height='40px'/>
          <h2>{group}</h2>
        </div>
        
        <div className='title'>
          <RatingButtons rating={rating} currentUser={currentUser} document={document} rootUpdate={rootUpdate}/>

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
                  <EditForm content={content} title={title} document={document} parentLayer={layer} rootUpdate={rootUpdate} toggleEdit={toggleEdit} />
                  
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
                          <Delete document={document} currentUser={currentUser} parentLayer={layer}/>
                        </div>
                      :
                        <div></div>
                    }
                  </div>
                :
                  <div>
                  </div>
              }
            </div>
          </div>
        </div>
        <ReplyForm currentUser={currentUser} hidden={formHidden} document={document} parentLayer={layer} rootUpdate={rootUpdate} switchHidden={switchHidden} />
      
        <SubDiscussionBody currentUser={currentUser} documents={subDocs} rootUpdate={rootUpdate} />
      </div>
    </div>
  );
};

export default DiscussionBody;