import React, { useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const CreateGroup = (props) => {
  const { document, user ,hidden, update } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  let userLimit;
  const [pageLoading, setPageLoading] = useState(false);

  // Check current user creation
  const checkCreation = async () => {
    let uid = user.uid;
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      let info = cache.data().created_groups.length;
      userLimit = info;
    } catch (error) {
      console.log(error.code);
    }
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
          introduction: introduction
        });
    } catch (error) {
      console.log(error.code);
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
      console.log(error.code);
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
      console.log(error.code);
    }
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    await checkCreation();
    const { name, introduction, symbol } = event.target.elements;
    let uid = user.uid;
    let creator = (user.email).slice(0, -9);
    let nameValue = name.value;
    let introductionValue = introduction.value;
    let symbolFile = symbol.files[0];

    console.log(userLimit);
    if(document && document.some((groupDoc) => groupDoc.data().name  === nameValue)) {
      alert("Group already created!");
      setPageLoading(false);
      return;
    } else if(userLimit > 2) {
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
          <form onSubmit={handleCreateGroup}>
            <fieldset>
              <label htmlFor='name'>Name</label>
              <input type='text' id='name' name='name' placeholder='Groups name' required/><br></br>
              <label htmlFor='introduction'>Introduction</label>
              <textarea type='text' id='introduction' name='introduction' placeholder='What is this group for?' required/><br></br>
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