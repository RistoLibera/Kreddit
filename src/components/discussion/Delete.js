import React from 'react';
import { useHistory } from 'react-router-dom';
import FirebasePack from '../../config/FirebasePack';

const Search = (props) => {
  const history = useHistory();
  const { groupUID, id, currentUser, parentLayer } = props;

  // Check if subdiscussion
  const deleteThis = async () => {
    let confirmation = window.confirm('This action will wipe out everything in this discussion, proceed carefully!');
    if (!confirmation) {
      return;
    }

    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .doc(groupUID)
        .collection('discussions')
        .doc(id)
        .delete();
    } catch (error) {
      console.log(error);
    }

    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .doc(currentUser.uid)
        .collection('created-discussions')
        .doc(id)
        .delete();
    } catch (error) {
      console.log(error);
    }

    alert('success!');
    history.push('/discussions/00');
  };
  
  return (
    <button onClick={deleteThis}>Delete</button>
  );
};

export default Search;
