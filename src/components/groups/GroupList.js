import React, { useState, useEffect} from 'react';
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';

const GroupList = (props) => {
  const { documents, uid } = props;
  const [listTags, setListTags] = useState([]);

  // Check current user enrollment
  const checkGroup = async (name, uid) => {
    let buttonState = false;
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      let info = cache.data().joined_groups;
      if (info) {
        buttonState = info.some((groupName) => groupName === name);
      }
    } catch (error) {
      console.log(error);
    }
    return buttonState;
  };
  
  //  Join group
  const joinGroup = async (groupName, uid) => {
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(uid)
        .update({
          joined_groups: firebase.firestore.FieldValue.arrayUnion(groupName)
        });
      alert('success!');
    } catch (error) {
      console.log(error);
    }
  };
  
  // Get group symbol
  async function getSymbol(name) {
    let symbolURL = Default;
    try {
      symbolURL =
        await FirebasePack
          .storage()
          .ref('group-symbol/' + name + '/symbol.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error);
    }
    return symbolURL;
  }

  // Make one list HTML tag
  const makeList = (name, creator, introduction, symbolURL, index, buttonState) => {
    return (
      <li key={index} className='group-list'>
        <div className='left-block'>
          <img src={symbolURL} alt='icon' width='40px' />
          <h2>{name}</h2>
        </div>

        <div className='middle-block'>
          <p>Creator: {creator}</p>
          <p>{introduction}</p>
        </div>

        <div className='right-block'>
          <button onClick={() => joinGroup(name, uid)} disabled={buttonState}>Join</button>
          <button>To discussion by auto select group button</button>
        </div>
      </li>
    );
  };
    
  const createList = async () => {
    let name;
    let creator;
    let introduction;
    let list;
    let container = [];
    let symbolURL;
    let buttonState;

    for (const [index, doc] of documents.entries()) {
      creator = doc.data().creator;
      name = doc.data().name;
      introduction = doc.data().introduction;
      symbolURL = await getSymbol(name);
      buttonState = await checkGroup(name, uid);
      list =  makeList(name, creator, introduction, symbolURL, index, buttonState);
      container.push(list);
    }
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, [documents]);

  return (
    <div className='all-groups'>
      <ul>
        {listTags.map((li) => {
          return (
            li
          );
        })}
      </ul>
    </div>
  );
};

export default GroupList;