import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

const Groups = () => {
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [formHidden, setFormHidden] = useState("hidden");
  const [pageLoading, setPageLoading] = useState(false);

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };

  // Check if existed
  const checkExistence = async () => {
    let createdGroups = [];
    try {
      let cache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .get();
        if (cache) {
          cache.forEach((doc) => {
            createdGroups.push(doc.id);
          });    
        }
    } catch (error) {
      console.log(error.code);
    }
    return createdGroups;
  };
  
  // Create new group
  const createNew = async (name, uid, introduction) => {
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .doc(name)
        .set({
          name: name,
          creator: uid,
          introduction: introduction
        });
    } catch (error) {
      console.log(error.code);
    }
  };

  // Update symbol
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
  const updateInfo = async (name, uid) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .update({
          created_groups: firebase.firestore.FieldValue.arrayUnion(name)
        });
    } catch (error) {
      console.log(error.code);
    }
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { name, introduction, symbol } = event.target.elements;
    let uid = currentUser.uid;
    let nameValue = name.value;
    let introductionValue = introduction.value;
    let symbolFile = symbol.files[0];
    let createdGroups = [];

    createdGroups = await checkExistence();
    if(createdGroups && createdGroups.some((existedName) => existedName = nameValue)) {
      alert("Group already created!");
      setPageLoading(false);
      return;
    } else {
      // Create new group
      await createNew(nameValue, uid, introductionValue);
      await updateSymbol(nameValue, symbolFile);
      await updateInfo(name, uid);
    }
    event.target.reset();
    setPageLoading(false);
  };

  return (
    <section className='groups-page'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
          <div className='group-container'>
            <div className='create-group'>
              <header>
                <h2>You can own at most five groups</h2>
                {currentUser 
                ? <button onClick={switchHidden}>Create a group</button>
                : <div></div>
                }
              </header>

              <div className={formHidden}>
                <form onSubmit={handleCreateGroup}>
                  <fieldset>
                    <label htmlFor='name'>Introduction</label>
                    <input type='text' id='name' name='name' placeholder='Groups name' required/><br></br>
                    <label htmlFor='introduction'>Introduction</label>
                    <textarea type='text' id='introduction' name='introduction' placeholder='What is this group for?' required/><br></br>
                    <label htmlFor='symbol'>Symbol</label>
                    <input type='file' id='symbol' name='symbol' required/><br></br>
                    <button className='submit' type='submit' value='Submit'>Create</button>
                  </fieldset>
                </form>
              </div>
            </div>

            <div className='group-list'>
              <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
                <li>6</li>
              </ul>
            </div>
          </div>
      }
    </section>
  );
};

export default Groups;
