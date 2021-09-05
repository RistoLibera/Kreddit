import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import DefaultIcon from '../../assets/img/default-icon.jpg';
import DefaultSymbol from '../../assets/img/default-symbol.png';
import Content from './Content';
import EditForm from './EditForm';
import Delete from './Delete';

const DiscussionBody = (props) => {
  const { currentUser } = useContext(AuthContext);
  const { groupUID, document, rootUpdate } = props;
  const [group, setGroup] = useState('');
  const [symbolURL, setSymbolURL] = useState('');
  const [iconURL, setIconURL] = useState('');
  const [title, setTitle] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [creator, setCreator] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [editShow, setEditShow] = useState(false);
  
  // Toggle edit form
  const toggleEdit = () => {
    setEditShow(!editShow);
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
    await getIcon(data.creator_uid);
    await getImg(data.title);
    await getSymbol(data.group);
    setTitle(data.title);
    setCreator(data.creator_name); 
    setTime(data.created_time.toDate().toString());
    setContent(data.content);
    setGroup(data.group);
  };

  useEffect(() => {
    fetchTitleContent();
  }, [document]);

  return (
    <div className='discussion-content'>

      <div className='discussion-container'>
        <div className='title'>
          <header className='title-header'>
            <div className='title-group'>
              <h2>{group}</h2>
              <img src={symbolURL} alt='symbol' width='40px' height='40px'/>
            </div>

            <div className='title-rating'>
              <p>Up</p>
              <p>Rating</p>
              <p>Down</p>
            </div>
          </header>

          <div className='title-body'>
            <header className='title-header'>
              <img src={iconURL} alt='icon' width='30px' height='30px'/>
              <h1>{creator}</h1>
              <h1>{title}</h1>
              <h1>{time}</h1>
            </header>

            <div className='title-content'>
              <img src={imgURL} alt='img' width='70px' />
              {editShow
                ?
                  <EditForm groupUID={groupUID} content={content} title={title} document={document} rootUpdate={rootUpdate} toggleEdit={toggleEdit} />
                :
                  <Content content={content} />
              }
            </div>

            <div className='title-buttons'>
              {(currentUser && currentUser.uid === document.data().creator_uid)
                ?
                  <div className='controller'>
                    <button>Reply</button>
                    <button onClick={toggleEdit}>Edit</button>
                    <Delete groupUID={groupUID} document={document} rootUpdate={rootUpdate} />
                  </div>
                :
                  <div className='controller'>
                    <button>Reply</button>
                  </div>
              }
            </div>
          </div>
        </div>

        <div className='subdiscussions'>
          {/* Component */}
        </div>
      </div>
    </div>
  );
};

export default DiscussionBody;