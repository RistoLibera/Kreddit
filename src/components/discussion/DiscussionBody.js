import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import Default from '../../assets/img/default-icon.jpg';
import Content from './Content';
import EditForm from './EditForm';

const DiscussionBody = (props) => {
  const { currentUser } = useContext(AuthContext);
  const { document } = props;
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

  // Fetch creator icon
  const getIcon = async (uid) => {
    let URL = Default;
    try {
      URL = 
        await FirebasePack
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    return URL;
  };

  // Fetch title content img
  const getImg = async (title) => {
    let URL = Default;
    try {
      URL = 
        await FirebasePack
          .storage()
          .ref('discussion-title-image/' + title + '/img.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    return URL;
  };
  
  const fetchTitleContent = async () => {
    let data = document.data();
    let URL = await getIcon(data.creator_uid);
    setIconURL(URL);
    URL = await getImg(data.title);
    setImgURL(URL);
    setTitle(data.title);
    setCreator(data.creator_name); 
    setTime(data.created_time.toDate().toString());
    setContent(data.content);
  };

  useEffect(() => {
    fetchTitleContent();
  }, []);

  return (
    <div className='discussion-container'>
      <div className='title'>
        <div className='title-rating'>
          <p>Up</p>
          <p>Rating</p>
          <p>Down</p>
        </div>

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
                <EditForm content={content} />
              :
                <Content content={content} />
            }
          </div>

          <div className='title-buttons'>
            <button>Reply</button>
            <button onClick={toggleEdit}>Edit</button>
            <button>Delete?</button>
          </div>
        </div>
      </div>

      <div className='subdiscussions'>
        {/* Component */}
      </div>
    </div>

  );
};

export default DiscussionBody;