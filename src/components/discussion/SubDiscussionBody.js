import React, { useState, useEffect } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';

const SubDiscussionBody = (props) => {
  const { currentUser, documents, rootUpdate } = props;

  // icon name && content   4 kinds of buttons\

  // Get all sub recursively


  const showSubs = () => {
    return(
      <div className='subdiscussion-container'>
        <div className='subdiscussion-body'>
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
        </div>
      </div>
    );
  };
  
  useEffect(() => {
  }, [documents]);

  return (
    <div className='subdiscussion-content'>
      <h1>SubDiscussionBody</h1>
    </div>
  );
};

export default SubDiscussionBody;