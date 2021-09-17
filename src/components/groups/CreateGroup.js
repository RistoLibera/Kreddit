import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle , faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import toast from 'react-hot-toast';

const CreateGroup = (props) => {
  const { t } = useTranslation('group');
  const { documents, currentUser ,hidden, update } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);

  // Check current groups creation
  const checkCreation = async () => {
    let amount = 0;
    let uid = currentUser.uid;
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      let info = cache.data().created_groups;
      if (info) {
        amount = info.length;
      }
    } catch (error) {
      console.log(error);
    }
    return amount;
  };
  
  // Create new group
  const createNew = async (name, creator, introduction) => {
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .doc()
        .set({
          name: name,
          creator: creator,
          introduction: introduction,
          created_time: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Update group symbol
  const updateSymbol = async (name, symbol) => {
    if (!symbol) return;
    try {
      await FirebasePack
        .storage()
        .ref('group-symbol/' + name + '/symbol.jpg')
        .put(symbol);
    } catch (error) {
      console.log(error);
    }
  };

  //  Update user info
  const updateInfo = async (groupName, uid) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .update({
          created_groups: firebase.firestore.FieldValue.arrayUnion(groupName)
        });
    } catch (error) {
      console.log(error);
    }
  };

  // Corner notification block
  const alertNotif = () => {
    toast((e) => (
      <span onClick={() => toast.dismiss(e.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faTimesCircle} color='red' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{t('content.creation-alert')}</span>
      </span>
    ));
  };
  
  // Corner notification block
  const warningNotif = () => {
    toast((e) => (
      <span onClick={() => toast.dismiss(e.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faExclamationCircle} color='#CCCC00' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{t('content.creation-warning')}</span>
      </span>
    ));
  };

  // Corner notification block
  const successNotif = () => {
    toast((e) => (
      <span onClick={() => toast.dismiss(e.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faCheckCircle} color='green' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>{t('content.success')}</span>
      </span>
    ));
  };
  
  const handleCreation = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    let amount = await checkCreation();
    const { name, introduction, symbol } = event.target.elements;
    let uid = currentUser.uid;
    let creator = (currentUser.email).slice(0, -9);
    let nameValue = name.value;
    let introductionValue = introduction.value;
    let symbolFile = symbol.files[0];

    if(documents && documents.some((groupDoc) => groupDoc.data().name  === nameValue)) {
      alertNotif();
      setPageLoading(false);
      return;
    } else if(amount > 3) {
      warningNotif();
      setPageLoading(false);
      return;
    } else {
      // Create new group
      await createNew(nameValue, creator, introductionValue);
      await updateSymbol(nameValue, symbolFile);
      await updateInfo(nameValue, uid);
      successNotif();
    }
    event.target.reset();
    setPageLoading(false);
    update();
  };

  return (
    <div className={hidden} id="create-group">
      {pageLoading
        ?
          <div className='block-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <form onSubmit={handleCreation}>
            <legend>{t('content.group-limit')}</legend>
            <fieldset className='input-name'>
              <label htmlFor='name'>{t('content.group-name')}</label>
              <input type='text' id='name' name='name' placeholder={t('content.group-name-holder')} minLength='3' maxLength='20' required/><br></br>
            </fieldset>

            <fieldset className='input-intro'>
              <label htmlFor='introduction'>{t('content.introduction')}</label>
              <textarea rows="5" cols='50' type='text' id='introduction' name='introduction' placeholder={t('content.introduction-holder')} maxLength="150" required/><br></br>
            </fieldset>

            <fieldset className='upload'>
              <label id="symbol" htmlFor='files'>{t('content.symbol')}</label>
              <input type='file' id='files' name='symbol'/><br></br>
              <button className='submit' type='submit' value='Submit'>{t('content.create')}</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default CreateGroup;