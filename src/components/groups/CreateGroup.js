import React, { useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const CreateGroup = (props) => {
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
      alert("Group already created!");
      setPageLoading(false);
      return;
    } else if(amount > 3) {
      alert("Reach creation limit!");
      setPageLoading(false);
      return;
    } else {
      // Create new group
      await createNew(nameValue, creator, introductionValue);
      await updateSymbol(nameValue, symbolFile);
      await updateInfo(nameValue, uid);
      alert('success!');
    }
    event.target.reset();
    setPageLoading(false);
    update();
  };

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
              <legend>You can create at most four groups</legend>
              <label htmlFor='name'>Name</label>
              <input type='text' id='name' name='name' placeholder='3 or more characters!' minLength='3' maxLength='20' required/><br></br>
              <label htmlFor='introduction'>Introduction</label>
              <textarea type='text' id='introduction' name='introduction' maxLength="80" placeholder='What is this group for?' required/><br></br>
              <label htmlFor='symbol'>Symbol</label>
              <input type='file' id='symbol' name='symbol' required/><br></br>
              <button className='submit' type='submit' value='Submit'>Create</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default CreateGroup;