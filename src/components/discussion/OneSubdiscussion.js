import React, { useState, useEffect }  from 'react';
import { DateTime, Interval } from "luxon";
import FirebasePack from '../../config/FirebasePack';
import DefaultIcon from '../../assets/img/default-icon.jpg';
import ReplyForm from './ReplyForm';
import EditForm from './EditForm';
import Delete from './Delete';
import RatingButtons from './RatingButtons';

const OneSubdiscussion = (props) => {
  const { currentUser, document, rootUpdate } = props;
  const title = '';
  const [beEditor, setBeEditor] = useState(false);
  const [layerClass, setLayerClass] =useState('');
  const [editShow, setEditShow] = useState(false);
  const [formHidden, setFormHidden] = useState('hidden');
  const [iconURL, setIconURL] = useState('');
  const [creator, setCreator] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [layer, setLayer] = useState(0);

  const checkCurrentEditor = () => {
    let beCurrentEditor = currentUser.uid === document.data().creator_uid;
    setBeEditor(beCurrentEditor);
  };

  // Adjust block width
  const makeLayerClass = () => {
    let className = 'content-layer-' + document.data().layer; 
    setLayerClass(className);
  };

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };
  
  // Toggle edit form
  const toggleEdit = () => {
    if(currentUser.uid !== document.data().creator_uid) {
      alert("You can't");
      return;
    }
    setEditShow(!editShow);
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

  const decypherDocument = async () => {
    let data = document.data();
    await getIcon(data.creator_uid);
    setCreator(data.creator_name);
    calculateTime(data);
    setContent(data.content);
    setRating(data.rating_up.length - data.rating_down.length);
    setLayer(data.layer);
  };

  useEffect(() => {
    checkCurrentEditor();
    makeLayerClass();
    decypherDocument();
  }, [document]);


  return (
    <div className={layerClass}>
      <header className='subdiscussion-header'>
        <img src={iconURL} alt='icon' width='30px' height='30px'/>
        <h1>{creator}</h1>
        <h1>{time}</h1>
      </header>

      <div className='subdiscussion-content'>
        {editShow
          ? 
            <EditForm content={content} title={title} document={document} parentLayer={layer} rootUpdate={rootUpdate} toggleEdit={toggleEdit} />
            
          :
          <h2>{content}</h2>
        }
      </div>

      <div className='subdiscussion-buttons'>
        <RatingButtons rating={rating} currentUser={currentUser} document={document} rootUpdate={rootUpdate}/>
        {currentUser
          ?
            <div className='interaction'>
              <button className='reply-discussion' onClick={switchHidden}>Reply</button>
              <button className='edit-discussion' onClick={toggleEdit} >Edit</button>
              <Delete document={document} currentUser={currentUser} parentLayer={layer} beEditor={beEditor} />
            </div>
          :
            <div className='interaction'>
              <button className='reply-discussion'>Reply</button>
              <button className='edit-discussion'>Edit</button>
              <button className='delete-discussion'>Delete</button>
            </div>
          }
      </div>
      <ReplyForm currentUser={currentUser} hidden={formHidden} document={document} parentLayer={layer} rootUpdate={rootUpdate} switchHidden={switchHidden} />
    </div>
  );
};

export default OneSubdiscussion;
