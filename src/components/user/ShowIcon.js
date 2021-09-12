import React, { useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const ShowIcon = (props) => {
  const { uid, iconURL, iconError, update } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [loading, setLoading] = useState(false);

  // Also update header icon
  const updateHeader = () => {
    const megatron = document.querySelector("#megatron");
    megatron.click();
  };

  const uploadIcon = async (event) => {
    const file = event.target.files[0];
    setLoading(true);
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
    setLoading(false);
  };
  
  return (
    <div className='profile-icon'>
      <img src={iconURL} alt='icon' width='100px' />
      <span hidden={!loading}>
        <BarLoader color='#D5D736' css={spinnerCSS} size={50} />
      </span>
      <input onChange={uploadIcon} type='file' name='icon'/>
      <h2>{iconError}</h2>
    </div>
  );
};

export default ShowIcon;