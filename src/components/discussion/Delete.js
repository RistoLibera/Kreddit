import React from 'react';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Search = (props) => {
  const { document, currentUser, parentLayer, beEditor, rootUpdate } = props;
  const history = useHistory();
  
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
      toast((t) => (
        <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
          <span>❌</span>
          <span style={{ paddingLeft: '10px'}}>You can't!</span>
        </span>
      ));
      return;
    }
    let confirmation = window.confirm('This action will wipe out everything in this discussion, proceed with caution!');
    if (!confirmation) {
      return;
    }
    await deleteRecord();
    await deleteInfo();
    toast((t) => (
      <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer'}}>
        <span>✅</span>
        <span style={{ paddingLeft: '10px'}}>success!</span>
      </span>
    ));
    rootUpdate();
    if (parentLayer === 0 ) {
      history.push('/discussions/00');
    }
  };
  
  return (
    <div className="delete-block">
      <Toaster 
        position="bottom-right"
        reverseOrder={false}
      />
      <button className='delete-discussion' onClick={deleteThis}>
        <FontAwesomeIcon icon={faTrashAlt} color='' size='2x' />
      </button>
    </div>
  );
};

export default Search;
