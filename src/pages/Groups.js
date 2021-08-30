import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import '../styles/css/groups.css';


const Groups = () => {
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [formHidden, setFormHidden] = useState("hidden");
  const [pageLoading, setPageLoading] = useState('hidden');
  const [containerClass, setContainerClass] = useState('create-group-container');

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };

  const handleCreateGroup = async (event) => {
    event.preventDefault();
    const { name, introduction, symbol } = event.target.elements;
    let uid = currentUser.uid;
    let createdGroups = [];
    let nameValue = name.value;
    let introductionValue = introduction.value;

    setPageLoading('');
    setContainerClass('hidden');
    switchHidden();

    // Check contradiction
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
      alert(error);
    }

    if(createdGroups && createdGroups.some((existedName) => existedName = nameValue)) {
      alert("Group already created!");
      setPageLoading('hidden');
      setContainerClass('create-group-container');
      return;
    } else {
      // Create new group
      try {
        await FirebasePack
          .firestore()
          .collection('groups')
          .doc(nameValue)
          .set({
            name: nameValue,
            creator: uid,
            introduction: introductionValue
          });
      } catch (error) {
        alert(error);
      }

      try {
        await FirebasePack
          .storage()
          .ref('group-symbol/' + nameValue + '/symbol.jpg')
          .put(symbol.files[0]);
      } catch (error) {
        alert(error);
      }

      try {
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .update({
            created_groups: firebase.firestore.FieldValue.arrayUnion(nameValue)
          });
      } catch (error) {
        alert(error);
      }
    }

    event.target.reset();
    setPageLoading('hidden');
    setContainerClass('create-group-container');
  };
  // Data structure
  // groups - Anime -         content             - discussions - 0  1  2 - discussion - 0    1   2   3     - subdis - 0   1   2   3  
  //                -  creator symbol introduction  -            -  title  -             - content uid rating -        - content uid rating
  
  // user-info    -  notif - 0  - from: uid  content: what to do?
  // user-info    -    created-groups   -   name array creator
  //              -     created-discussions    - database position

  return (
    <section className='groups-page'>
      <div className={pageLoading}>
        <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
      </div>

      <div className={containerClass}>
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
    </section>
  );
};

export default Groups;
