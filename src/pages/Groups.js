import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import GroupList from '../components/groups/GroupList';

const Groups = () => {
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [formHidden, setFormHidden] = useState("hidden");
  const [pageLoading, setPageLoading] = useState(true);
  const [createdGroupsDoc, setCreatedGroupsDoc] = useState([]);

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };

  // Store groups
  const storeGroups = (cache) => {
    setCreatedGroupsDoc([]);
    if (cache) {
      cache.forEach((doc) => {
        setCreatedGroupsDoc(oldArray => [...oldArray, doc]);
      });   
    }
  };

  // Check if group existed
  const fetchGroups = async () => {
    try {
      let cache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .get();
        storeGroups(cache);
        } catch (error) {
      console.log(error.code);
    }
    setPageLoading(false);
  };
  
  // Create new group
  const createNew = async (name, uid, introduction) => {
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .doc()
        .set({
          name: name,
          creator: uid,
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
    const { name, introduction, symbol } = event.target.elements;
    let uid = currentUser.uid;
    let nameValue = name.value;
    let introductionValue = introduction.value;
    let symbolFile = symbol.files[0];

    console.log(createdGroupsDoc);
    if(createdGroupsDoc && createdGroupsDoc.some((groupDoc) => groupDoc.data().name  === nameValue)) {
      alert("Group already created!");
      setPageLoading(false);
      return;
    } else if(createdGroupsDoc.length > 2) {
      alert("Reach creation limit!");
      setPageLoading(false);
      return;
    } else {
      // Create new group
      await createNew(nameValue, uid, introductionValue);
      await updateSymbol(nameValue, symbolFile);
      await updateInfo(nameValue, uid);
      alert('success!');
    }
    event.target.reset();
    setPageLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, [createdGroupsDoc]);

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
                {currentUser 
                ? 
                  <div>
                    <h2>You can own at most three groups</h2>
                    <button onClick={switchHidden}>Create a group</button>
                  </div>
                : 
                  <div></div>
                }
              </header>

              <div className={formHidden}>
                <form onSubmit={handleCreateGroup}>
                  <fieldset>
                    <label htmlFor='name'>Creator</label>
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

            <GroupList document={createdGroupsDoc} />
          </div>
      }
    </section>
  );
};

export default Groups;
