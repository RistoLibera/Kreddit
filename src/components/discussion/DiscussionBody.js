import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../loading/Auth';
import { DateTime, Interval } from "luxon";
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faExclamationCircle, faReply, faTrashAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import ClockLoader from 'react-spinners/ClockLoader';
import DefaultIcon from '../../assets/img/default-icon.jpg';
import DefaultSymbol from '../../assets/img/default-symbol.png';
import ReplyForm from './ReplyForm';
import EditForm from './EditForm';
import Delete from './Delete';
import RatingButtons from './RatingButtons';
import SubDiscussionBody from './SubDiscussionBody';
import toast from 'react-hot-toast';

const DiscussionBody = (props) => {
  const { t } = useTranslation('discussion');
  const { currentUser } = useContext(AuthContext);
  const { document, rootUpdate, uid } = props;
  const history = useHistory();
  const spinnerCSS = css`
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(true);
  const [beEditor, setBeEditor] = useState(false);
  const [editHidden, setEditHidden] = useState('hidden');
  const [replyHidden, setReplyHidden] = useState('hidden');
  const [group, setGroup] = useState('');
  const [symbolURL, setSymbolURL] = useState('');
  const [iconURL, setIconURL] = useState('');
  const [title, setTitle] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [creator, setCreator] = useState('');
  const [creatorUID, setCreatorUID] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [layer, setLayer] = useState(0);
  const [subDocs, setSubDocs] = useState([]);
  const [editHeight, setEditHeight] = useState(0);

  const checkCurrentEditor = () => {
    if (!currentUser) return;
    let beCurrentEditor = currentUser.uid === document.data().creator_uid;
    setBeEditor(beCurrentEditor);
  };

  const switchReplyHidden = () => {
    if (replyHidden === 'hidden') {
      setReplyHidden('reply-form-container');
    } else {
      setReplyHidden('hidden');
    }
  };

  const switchEditHidden = () => {
    if (editHidden === 'hidden') {
      setEditHidden('edit-form-container');
    } else {
      setEditHidden('hidden');
    }
  };
  
  // Corner notification block
  const alertNotif = () => {
    toast((e) => (
      <span onClick={() => toast.dismiss(e.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faTimesCircle} color='red' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{t('content.alert')}</span>
      </span>
    ));
  };
  
  // Toggle edit form
  const toggleEdit = (event) => {
    if(currentUser.uid !== document.data().creator_uid) {
      alertNotif();
      return;
    }
    switchEditHidden();

    // Auto set edit textarea height
    if (!event) return;
    const paragraph =  event.target.closest('.title-buttons').parentNode.querySelector('.title-content').childNodes[2];
    let height = (paragraph.scrollHeight) + "px";
    setEditHeight(height);
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
    setCreatorUID(data.creator_uid);
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

  // Corner notification block
  const warningNotif = () => {
    toast((e) => (
      <span onClick={() => toast.dismiss(e.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faExclamationCircle} color='#CCCC00' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{t('content.warning')}</span>
      </span>
    ));
  };
  
  const initialState = async () => {
    if (document.length === 0) return;
    if (!document.exists) {
      warningNotif();
      history.push('/discussions/00');
      return;
    }
    checkCurrentEditor();
    await fetchTitleContent();
    await fetchSubdiscussionInfos();
    setPageLoading(false);
  };

  useEffect(() => {
    initialState();
  }, [document]);

  useEffect(() => {
    setPageLoading(true);
    initialState();
  }, [uid]);

  return (
    <div className='discussion-container'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClockLoader color='#8E5829' css={spinnerCSS} size={100} />
          </div>
        :
          <div className='discussion-content'>
            <div className='group'>
              <span className='group-symbol' style={{ backgroundImage: `url('${symbolURL}')` }} ></span>
              <h2 className='group-name'>{group}</h2>
            </div>
            
            <div className='title'>
              <RatingButtons rating={rating} currentUser={currentUser} document={document} rootUpdate={rootUpdate}/>

              <div className='title-body'>
                <header className='body-header'>
                  <div className="creator"  onClick={() => history.push('/profile/' + creatorUID)}>
                    <span className='group-symbol' style={{ backgroundImage: `url('${iconURL}')` }} ></span>
                    <h1 className='name'>{creator}</h1>
                    <h1 className='time'>{time}</h1>
                  </div>

                  <div className="title-name">
                    <h1>{title}</h1>
                  </div>
                </header>

                <div className='title-content'>
                  <img className='title-img' src={imgURL} alt='' width='300px' />
                  <EditForm hidden={editHidden} height={editHeight} content={content} title={title} document={document} parentLayer={layer} rootUpdate={rootUpdate} toggleEdit={toggleEdit} />
                  <p className={(editHidden === 'hidden' ?  'scripting' : 'hidden')} >{content}</p>
                </div>

                <div className='title-buttons'>
                  {currentUser
                    ?
                      <div className='interaction'>
                        <button className='reply-discussion' onClick={switchReplyHidden}>
                          <FontAwesomeIcon icon={faReply} color='' size='2x' />
                        </button>
                        <button className='edit-discussion' onClick={toggleEdit} >
                          <FontAwesomeIcon icon={faEdit} color='' size='2x' />
                        </button>
                        <Delete document={document} currentUser={currentUser} parentLayer={layer} beEditor={beEditor}  rootUpdate={rootUpdate}/>
                      </div>
                    :
                      <div className='interaction'>
                        <button className='reply-discussion'>
                          <FontAwesomeIcon icon={faReply} color='' size='2x' />
                        </button>
                        <button className='edit-discussion'>
                          <FontAwesomeIcon icon={faEdit} color='' size='2x' />
                        </button>
                        <button className='delete-discussion'>
                          <FontAwesomeIcon icon={faTrashAlt} color='' size='2x' />
                        </button>
                      </div>
                  }
                </div>
              </div>

            </div>
            <ReplyForm currentUser={currentUser} hidden={replyHidden} document={document} parentLayer={layer} rootUpdate={rootUpdate} switchHidden={switchReplyHidden} />

            <SubDiscussionBody currentUser={currentUser} documents={subDocs} rootUpdate={rootUpdate} />
          </div>
      }
    </div>
  );
};

export default DiscussionBody;