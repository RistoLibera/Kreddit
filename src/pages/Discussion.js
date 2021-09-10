import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import DiscussionBody from '../components/discussion/DiscussionBody';
import '../styles/css/discussion.css';

const Discussion = () => {
  const { group, uid }  = useParams();
  const [discussionDoc, setDiscussionDoc] = useState([]);

  // Store one discussion
  const storeThisDiscussion = async (groupDoc) => {
    let thisDiscussionDoc = await groupDoc.ref.collection('discussions').doc(uid).get(); 
    setDiscussionDoc(thisDiscussionDoc);
  };

  const fetchThisDiscussion = async () => {
    let groupDoc;
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
  };
  
  useEffect(() => {
    fetchThisDiscussion();
  }, []);

  return (
    <section className='discussion-page'>
      <DiscussionBody document={discussionDoc} rootUpdate={fetchThisDiscussion} />
    </section>
  );
};

export default Discussion;
