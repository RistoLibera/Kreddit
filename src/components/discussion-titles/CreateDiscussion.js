import React, { useState, useEffect} from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

//  change view matrix or line
const CreateDiscussion = (props) => {
  const { user, hidden, update } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);
  const [optionsTags, setOptionsTags] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  // Check current user enrollment
  const checkGroup = async (user) => {
    let groups;
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(user.uid)
          .get();
      groups = cache.data().joined_groups;
    } catch (error) {
      console.log(error);
    }
    return groups;
  };

  // Make one option HTML tag
  const makeOption = (groups) => {
    let container = [];
    if (groups.length === 0 ) {
      let warningTag = <option key='0' value='0'>You need a group!</option>;
      setOptionsTags(warningTag);
      setDisabledButton(true);
    } else {
      groups.forEach((group, index) => {
        let tag = <option key={index} value={group}>{group}</option>;
        container.push(tag);
      });  
    }
    setOptionsTags(container);
  };

  // Update Firestore
  const addDiscussion = async (group, title, content, user) => {
    let creator = (user.email).slice(0, -9);
    let uid = user.uid;
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .where('name', '==', group)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.collection('discussions').doc().set({
              creator_name: creator,
              creator_uid: uid,
              group: group,
              title: title,
              content: content,
              subdiscussions: 0,
              rating_up: [],
              rating_down: [],
              created_time: firebase.firestore.FieldValue.serverTimestamp(),
              layer: 0,
              layer_structure: 0
            });    
          });
        });
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };

  // Update FireStorage
  const addImg = async (title, attachment) => {
    try {
      await FirebasePack
        .storage()
        .ref('discussion-title-image/' + title + '/img.jpg')
        .put(attachment);
    } catch (error) {
      console.log(error);
    }

  };

  // Fill selective button
  const fillButton = async () => {
    let groups = await checkGroup(user);
    makeOption(groups);
  };

  const handleCreation = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { group, title, content, attachment} = event.target.elements;
    let groupValue = group.value;
    let titleValue = title.value;
    let contentValue = content.value;
    let attachmentValue = attachment.files[0];
    await addDiscussion(groupValue, titleValue, contentValue, user);
    await addImg(titleValue, attachmentValue);
    alert('success!');
    event.target.reset();
    setPageLoading(false);
    update();
  };

  useEffect(() => {
    fillButton();
  }, []);

  // Zero group = You must enter a group to discuss!

  return (
    <div className={hidden}>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <form onSubmit={handleCreation}>
            <fieldset>
              <legend>Discussion</legend>
              <select id='group' name='group'>
                {optionsTags.map((option) => {
                  return (
                    option
                  );
                })}
              </select>
              <label htmlFor='title'>Title</label>
              <input type='text' id='title' name='title' placeholder='Title' required/><br></br>
              <label htmlFor='content'>Content</label>
              <textarea type='text' id='content' name='content' maxLength="200" placeholder='Content' required/><br></br>
              <label htmlFor='attachment'>Attachment</label>
              <input type='file' id='attachment' name='attachment'/><br></br>
              <button className='submit' type='submit' value='Submit' disabled={disabledButton}>Create</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default CreateDiscussion;