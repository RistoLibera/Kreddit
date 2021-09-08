import React, { useState, useEffect } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';

const SubDiscussionBody = (props) => {
  const { currentUser, rootDocument } = props;

  // icon name && content   4 kinds of buttons\

  // Get all sub recursively
  return (
    <div className='subdiscussion-container'>
      <h1>SubDiscussionBody</h1>
    </div>
  );
};

export default SubDiscussionBody;