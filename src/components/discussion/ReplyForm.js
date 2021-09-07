import React, { useState, useEffect }  from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const ReplyForm = (props) => {
  const { user, hidden, document, parentLayer, layerStructure, rootUpdate, switchHidden } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);
  const [layerClass, setLayerClass] =useState('');

  // Adjust block width
  const makeLayerClass = () => {
    let className = 'edit-layer-' + parentLayer; 
    setLayerClass(className);
  };

  // Add subdiscussion
  const addSub = async (content, layer) => {
    let creator = (user.email).slice(0, -9);
    let uid = user.uid;
    let randomUID;

    if (parentLayer === 0) {
      try {
        const randomDoc =
          await document
            .ref
            .collection('subdiscussions')
            .doc();
          await randomDoc
          .set({
            creator_name: creator,
            creator_uid: uid,
            content: content,
            rating_up: [],
            rating_down: [],
            created_time: firebase.firestore.FieldValue.serverTimestamp(),
            layer: layer
          });
          randomUID = randomDoc.id;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const randomDoc =
          await document
            .ref
            .parent
            .doc();
          await randomDoc
            .set({
              creator_name: creator,
              creator_uid: uid,
              content: content,
              rating_up: [],
              rating_down: [],
              created_time: firebase.firestore.FieldValue.serverTimestamp(),
              layer: layer
            });
          randomUID = randomDoc.id;
      } catch (error) {
        console.log(error);
      }
    }
    return randomUID;
  };

  // Update replied by
  const updateReplied = async (uid) => {
    if (parentLayer === 0) {
      try {
        await document
        .ref
        .update({
          replied_by: firebase.firestore.FieldValue.arrayUnion(uid),
          layerStructure: ((parentLayer + 1 > layerStructure) ?  layerStructure + 1 : layerStructure)
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await document
        .ref
        .update({
          replied_by: firebase.firestore.FieldValue.arrayUnion(uid)
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Update user info
  const updateInfo = async (subUID, uid) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .collection('created-subdiscussions')
        .doc(subUID)
        .set({
          discussion_uid: subUID,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { content } = event.target.elements;
    let contentValue = content.value;
    let layer = parentLayer + 1;
    let subUID = await addSub(contentValue, layer);
    await updateReplied(subUID);
    await updateInfo(subUID, user.uid);
    alert('success!');
    event.target.reset();
    switchHidden();
    setPageLoading(false);
    rootUpdate();
  };

  useEffect(() => {
    makeLayerClass();
  }, []);

  return (
    <div className={hidden}>
      <div className={layerClass}>
        {pageLoading
          ?
            <div className='page-loader'>
              <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
            </div>
          :
            <form onSubmit={handleReply}>
              <fieldset>
                <textarea type='text' id='content' name='content' maxLength="200" placeholder='Content' required/><br></br>
                <button className='submit' type='submit' value='Submit'>Create</button>
              </fieldset>
            </form>
        }
      </div>
    </div>
  );
};

export default ReplyForm;
