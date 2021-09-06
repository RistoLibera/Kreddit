import React from 'react';
import { useHistory } from 'react-router-dom';
import FirebasePack from '../../config/FirebasePack';

const Search = (props) => {
  const history = useHistory();
  const { groupUID, document } = props;

  const deleteDiscussion = async () => {
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
        .doc(document.id)
        .delete();
      } catch (error) {
      console.log(error);
    }
    alert('success!');
    history.push('/discussions');
  };
  
  return (
    <button onClick={deleteDiscussion}>Delete</button>
  );
};

export default Search;
