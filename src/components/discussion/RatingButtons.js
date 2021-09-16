import React, { useState, useEffect } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareDown, faCaretSquareUp, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

const RatingButtons = (props) => {
  const { rating, currentUser, document, rootUpdate } = props;
  const [disableUp, setDisableUp] = useState(false);
  const [disableDown, setDisableDown] = useState(false);

  // Corner notification block
  const warningNotif = () => {
    toast((t) => (
      <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faExclamationCircle} color='#CCCC00' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>Please log in!</span>
      </span>
    ));
  };

  // Check if rated
  const checkRated = async () => {
    if (document.length === 0) return;
    if (!currentUser) {
      return;
    }
    let currentUID = currentUser.uid;
    let data = document.data();
    let hasRatingUp = data.rating_up.some((uid) => uid === currentUID);
    let hasRatingDown = data.rating_down.some((uid) => uid === currentUID);
    if (hasRatingUp) setDisableUp(true);
    if (hasRatingDown) setDisableDown(true);
  };

  // Update rating
  const triggerRating = async (fondness) => {
    if (fondness) {
      try {
        await document
          .ref
          .update({
            rating_up: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
            rating_down: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await document
          .ref
          .update({
            rating_down: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
            rating_up: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
          });
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  // Send notification
  const sendNotif = async () => {
    let creator_uid = document.data().creator_uid;
    if (currentUser.uid === creator_uid) return;
    let sender = (currentUser.email).slice(0, -9);
    let url = '/discussions/' + document.data().group_name + '/' + document.data().discussion_uid;
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(creator_uid)
        .collection('notifications')
        .doc(sender)
        .set({
          rate: true,
          url: url,
          sender: sender,
          created_time: firebase.firestore.FieldValue.serverTimestamp()
        }, {merge: true});
    } catch (error) {
      console.log(error);
    }
  };

  const triggerUp = async () => {
    if (currentUser) {
      await triggerRating(true);
      setDisableUp(true);
      setDisableDown(false);
      await sendNotif(currentUser.uid);
      rootUpdate();
    } else {
      warningNotif();
    }
  };

  const triggerDown = async () => {
    if (currentUser) {
      await triggerRating(false);
      setDisableDown(true);
      setDisableUp(false);
      await sendNotif(currentUser.uid);
      rootUpdate();
    } else {
      warningNotif();
    }
  };

  useEffect(() => {
    checkRated();
  }, []);

  return (
    <div className='title-rating'>
      <button onClick={triggerUp} disabled={disableUp}>
        <FontAwesomeIcon icon={faCaretSquareUp} color='' size='2x' />
      </button>
      <span>{rating}</span>
      <button onClick={triggerDown} disabled={disableDown}>
        <FontAwesomeIcon icon={faCaretSquareDown} color='' size='2x' />
      </button>
    </div>
  );
};

export default RatingButtons;


