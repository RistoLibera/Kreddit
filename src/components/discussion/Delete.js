import React from 'react';
import { useHistory } from 'react-router-dom';
import FirebasePack from '../../config/FirebasePack';

const Search = (props) => {
  const history = useHistory();
  const { document, currentUser, parentLayer } = props;

  // Delete discussion or subdiscussion
  const deleteRecord = async () => {
    try {
      await document
        .ref
        .delete();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete info
  const deleteInfo = async () => {
    if (parentLayer === 0 ) {
      try {
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(currentUser.uid)
          .collection('created-discussions')
          .doc(document.id)
          .delete();
      } catch (error) {
        console.log(error);
      }  
    } else {
      try {
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(currentUser.uid)
          .collection('created-subdiscussions')
          .doc(document.id)
          .delete();
      } catch (error) {
        console.log(error);
      }  
    }
  };

  const deleteThis = async () => {
    let confirmation = window.confirm('This action will wipe out everything in this discussion, proceed carefully!');
    if (!confirmation) {
      return;
    }
    await deleteRecord();
    await deleteInfo();
    alert('success!');
    history.push('/discussions/00');
  };
  
  return (
    <button onClick={deleteThis}>Delete</button>
  );
};

export default Search;
