import React, { useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const ShowIcon = (props) => {
  const { uid, iconURL, update } = props;
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
    <figure className='profile-icon' style={{ backgroundImage: `url('${iconURL}')` }}>
      <div className='upload'>
        <input onChange={uploadIcon} type="file" id="files" />
        <label htmlFor="files">
         <FontAwesomeIcon icon={faPlusCircle} color='black' size='2x' />
        </label>
      </div>
      <span hidden={!loading}>
        <BarLoader color='#D5D736' css={spinnerCSS} size={50} />
      </span>
    </figure>
  );
};

export default ShowIcon;