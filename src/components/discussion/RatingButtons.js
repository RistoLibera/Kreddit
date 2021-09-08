import React, { useState, useEffect } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretSquareDown, faCaretSquareUp } from '@fortawesome/free-solid-svg-icons';

const RatingButtons = (props) => {
  const { rating, currentUser, document, rootUpdate } = props;
  const [disableUp, setDisableUp] = useState(false);
  const [disableDown, setDisableDown] = useState(false);

  // Trigger warning when not logged in
  const triggerWarning = () => {
    alert('Please log in!');
  };

  // Check if rated
  const checkRated = async () => {
    if (!currentUser) {
      setDisableUp(true);
      setDisableDown(true);
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

  const triggerUp = async () => {
    if (currentUser) {
      await triggerRating(true);
      setDisableUp(true);
      setDisableDown(false);
      rootUpdate();
    } else {
      triggerWarning();
    }
  };

  const triggerDown = async () => {
    if (currentUser) {
      await triggerRating(false);
      setDisableDown(true);
      setDisableUp(false);
      rootUpdate();
    } else {
      triggerWarning();
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


