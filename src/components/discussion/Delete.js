import React from 'react';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Search = (props) => {
  const { document, currentUser, parentLayer, beEditor, rootUpdate } = props;

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
    if(!beEditor) {
      alert("You can't");
      return;
    }
    let confirmation = window.confirm('This action will wipe out everything in this discussion, proceed carefully!');
    if (!confirmation) {
      return;
    }
    await deleteRecord();
    await deleteInfo();
    alert('success!');
    rootUpdate();
    // history.push('/discussions/00');
  };
  
  return (
    <button className='delete-discussion' onClick={deleteThis}>
      <FontAwesomeIcon icon={faTrashAlt} color='' size='2x' />
    </button>
  );
};

export default Search;
