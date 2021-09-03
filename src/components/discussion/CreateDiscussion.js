import React, { useState, useEffect} from 'react';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

//  change view matrix or line
const CreateDiscussion = (props) => {
  const { hidden } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);

  const handleCreation = async () => {

  };

  // Zero group = You must enter a group to discuss!

  return (
    <div className={hidden}>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <form onSubmit={handleCreation}>
            <fieldset>
              <legend>Discussion</legend>
              <select id='group' name='group'>
                <option>choose a group</option>
              </select>
              <label htmlFor='title'>Title</label>
              <input type='text' id='title' name='title' placeholder='Title' required/><br></br>
              <label htmlFor='content'>Content</label>
              <textarea type='text' id='content' name='content' maxLength="200" placeholder='Content' required/><br></br>
              <label htmlFor='attachment'>Attachment</label>
              <input type='file' id='attachment' name='attachment' required/><br></br>
              <button className='submit' type='submit' value='Submit'>Create</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default CreateDiscussion;