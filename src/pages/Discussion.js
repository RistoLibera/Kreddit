import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import DiscussionBody from '../components/discussion/DiscussionBody';
import '../styles/css/discussion.css';

//  embed uid into reply and rate

const Discussion = () => {
  const { group, uid }  = useParams();
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(true);
  const [discussionDoc, setDiscussionDoc] = useState([]);

  // Store one discussion
  const storeThisDiscussion = async (groupDoc) => {
    let thisDiscussionDoc = await groupDoc.ref.collection('discussions').doc(uid).get(); 
    setDiscussionDoc(thisDiscussionDoc);
  };

  const fetchThisDiscussion = async () => {
    let groupDoc;
    setPageLoading(true);
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .where('name', '==', group)
        .get()
        .then((querySnapshot) => {
          groupDoc = querySnapshot.docs[0];
        });
      await storeThisDiscussion(groupDoc)  ;
      } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };
  
  useEffect(() => {
    fetchThisDiscussion();
  },[]);

  return (
    <section className='discussion-page'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
        <div className='discussion-content'>
          <div>
            <h2>Group info</h2>
          </div>
          <DiscussionBody document={discussionDoc} />
        </div>
      }
    </section>
  );
};

export default Discussion;
