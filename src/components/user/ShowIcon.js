import React, { useState, useEffect } from 'react';
import Firebase from '../../config/Firebase';

const ShowIcon = (props) => {
  const [loading, setLoading] = useState(false);
  const { uid, iconURL, iconError } = props;

  const uploadIcon = async (event) => {
    const file = event.target.files[0];
    setLoading(true);

    try {
      await Firebase
        .storage()
        .ref('user-icon/' + uid + '/icon.jpg')
        .put(file);
    } catch (error) {
      alert(error);
    }

    setLoading(false);
  };
  
  return (
    <div className='profile-icon'>
      <img src={iconURL} alt='icon' width='100px' />
      <span hidden={!loading}>...Loading...</span>
      <input onChange={uploadIcon} type='file' name='icon'/>
      <h2>{iconError}</h2>
    </div>
  );
};

export default ShowIcon;