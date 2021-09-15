import React, { useContext } from 'react';
import { AuthContext } from '../loading/Auth';
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const ShowIcon = (props) => {
  const { uid, iconURL, update } = props;
  const { currentUser } = useContext(AuthContext);

  const isCurrentUser = () => {
    let currentUID;
    if(currentUser) {
      currentUID = currentUser.uid;
      if(currentUID === uid) {
        return true;
      }
    } else {
      return false;
    }
  };

  // Also update header icon
  const updateHeader = () => {
    const megatron = document.querySelector("#megatron");
    megatron.click();
  };

  const uploadIcon = async (event) => {
    const file = event.target.files[0];
    try {
      await FirebasePack
        .storage()
        .ref('user-icon/' + uid + '/icon.jpg')
        .put(file);
    } catch (error) {
      console.log(error);
    }
    updateHeader();
    update();
  };
  
  return (
    <figure className='profile-icon' style={{ backgroundImage: `url('${iconURL}')` }}>
      {isCurrentUser()
        ?
          <div className='upload'>
            <input onChange={uploadIcon} type="file" id="files" />
            <label htmlFor="files">
            <FontAwesomeIcon icon={faPlusCircle} color='black' size='2x' />
            </label>
          </div>
        :
          <div></div>
        }
    </figure>
  );
};

export default ShowIcon;