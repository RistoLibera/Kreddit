import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

//  change view matrix or line
const CreateDiscussion = (props) => {
  const { t } = useTranslation('discussion');
  const { currentUser, hidden, switchHidden, update } = props;
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
    let groupInfos = [];
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(user.uid)
        .collection('joined-groups')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let info = {
              name: doc.data().group_name,
              uid: doc.data().group_uid
            };
            groupInfos.push(info);
          });
        });
    } catch (error) {
      console.log(error);
    }
    return groupInfos;
  };

  // Make one option HTML tag
  const makeOption = (groupInfos) => {
    let container = [];
    if (groupInfos.length === 0 ) {
      let warningTag = <option key='0' value='0'>{t('content.group-warning')}</option>;
      container.push(warningTag);
      setOptionsTags(container);
      setDisabledButton(true);
    } else {
      groupInfos.forEach((info, index) => {
        let tag = <option key={index} value={info.uid}>{info.name}</option>;
        container.push(tag);
      });  
    }
    setOptionsTags(container);
  };

  // Fill selective button
  const fillButton = async () => {
    let groupInfos = await checkGroup(currentUser);
    makeOption(groupInfos);
  };

  // Update Firestore
  const addDiscussion = async (groupUID, group, title, content) => {
    let creator = (currentUser.email).slice(0, -9);
    let uid = currentUser.uid;
    let randomUID;
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .where('name', '==', group)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const randomDoc = doc.ref.collection('discussions').doc();
            randomUID = randomDoc.id;
            randomDoc.set({
              creator_name: creator,
              creator_uid: uid,
              group_name: group,
              group_uid: groupUID,
              discussion_uid: randomUID,
              title: title,
              content: content,
              subdiscussions: 0,
              rating_up: [],
              rating_down: [],
              created_time: firebase.firestore.FieldValue.serverTimestamp(),
              layer: 0
            });    
          });
        });
    } catch (error) {
      console.log(error);
    }
    return randomUID;
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

  //  Update user info
  const updateInfo = async (groupUID, groupName, discussionUID, title , uid) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .collection('created-discussions')
        .doc(discussionUID)
        .set({
          group_uid: groupUID,
          group_name: groupName,
          discussion_uid: discussionUID,
          title: title
        });
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleCreation = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { group, title, content, attachment} = event.target.elements;
    let groupValue = group.options[group.selectedIndex].text;
    let groupUID = group.value;
    let titleValue = title.value;
    let contentValue = content.value;
    let attachmentValue = attachment.files[0];
    let discussionUID = await addDiscussion(groupUID, groupValue, titleValue, contentValue);
    await addImg(titleValue, attachmentValue);
    await updateInfo(groupUID, groupValue, discussionUID, titleValue, currentUser.uid);
    event.target.reset();
    switchHidden();
    alert('success!');
    setPageLoading(false);
    update();
  };

  useEffect(() => {
    fillButton();
  }, []);

  return (
    <div className={hidden} id='create-discussion'>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <form onSubmit={handleCreation}>
            <fieldset className='groups'>
              <legend>{t('content.discussion')}</legend>
              <select id='group' name='group'>
                {optionsTags.map((option) => {
                  return (
                    option
                  );
                })}
              </select>
            </fieldset>

            <fieldset className='input-title'>
              <label htmlFor='title'>{t('content.title')}</label>
              <input type='text' id='title' name='title' placeholder={t('content.title-holder')} required/><br></br>
            </fieldset>

            <fieldset className='input-content'>
              <label htmlFor='content'>{t('content.content')}</label>
              <textarea rows="5" cols='50' type='text' id='content' name='content' maxLength="200" placeholder={t('content.content-holder')} required/><br></br>
            </fieldset>

            <fieldset className='upload'>
              <label id="img" htmlFor='files'>{t('content.attachment')}</label>
              <input type='file' id='files' name='attachment'/><br></br>
              <button className='submit' type='submit' value='Submit' disabled={disabledButton}>{t('content.create')}</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default CreateDiscussion;