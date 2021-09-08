import React, { useState, useEffect }  from 'react';
import ReplyForm from './ReplyForm';
import EditForm from './EditForm';
import Delete from './Delete';

const OneSubdiscussion = (props) => {
  const { layer } = props;
  const [editShow, setEditShow] = useState(false);
  const [formHidden, setFormHidden] = useState('hidden');


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

  return (
    <div className='sub-layer-?'>
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
      <ReplyForm currentUser={currentUser} hidden={formHidden} document={document} parentLayer={layer} layerStructure={layerStructure} rootUpdate={rootUpdate} switchHidden={switchHidden} />
    </div>
  );
};

export default OneSubdiscussion;
