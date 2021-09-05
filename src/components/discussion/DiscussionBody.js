import React, { useState, useEffect, useContext } from 'react';
import FirebasePack from '../../config/FirebasePack';

const DiscussionBody = (props) => {
  const { document } = props;
  
  const fetchTitleContent = async () => {
  };

  useEffect(() => {
    fetchTitleContent();
  }, []);

  return (
    <div className='discussion-container'>
      <div className='title'>
        <div className='title-rating'>
          <p>Up</p>
          <p>Down</p>
        </div>

        <div className='title-body'>
          <header className='title-header'>
            <h1>icon</h1>
            <h1>name</h1>
            <h1>title</h1>
            <h1>time</h1>
          </header>

          <div className='title-content'>
            <h2>haha!</h2>
          </div>

          <div className='title-buttons'>
            <h2>Reply</h2>
            <h2>Edit?</h2>
            <h2>Delete?</h2>
          </div>
        </div>
      </div>

      <div className='subdiscussions'>
        
      </div>
    </div>

  );
};

export default DiscussionBody;