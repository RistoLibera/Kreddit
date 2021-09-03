import React, { useState, useEffect} from 'react';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

//  change view matrix or line
const CreateDiscussion = (props) => {
  const { user, hidden } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);
  const [optionsTags, setOptionsTags] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  // Check current user enrollment
  const checkGroup = async (user) => {
    let groups;
    try {
      let cache = 
        await FirebasePack
          .firestore()
          .collection('user-info')
          .doc(user.uid)
          .get();
      groups = cache.data().joined_groups;
    } catch (error) {
      console.log(error);
    }
    return groups;
  };

  // Make one option HTML tag
  const makeOption = (groups) => {
    let container = [];
    if (groups.length === 0 ) {
      let warningTag = <option key='0' value='0'>You need a group!</option>;
      setOptionsTags(warningTag);
      setDisabledButton(true);
    } else {
      groups.forEach((group, index) => {
        let tag = <option key={index} value={group}>{group}</option>;
        container.push(tag);
      });  
    }
    setOptionsTags(container);
  };

  // Fill selective button
  const fillButton = async () => {
    let groups = await checkGroup(user);
    makeOption(groups);
  };

  const handleCreation = async () => {

  };

  useEffect(() => {
    fillButton();
  }, []);

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
                {optionsTags.map((option) => {
                  return (
                    option
                  );
                })}
                <option>choose a group</option>
              </select>
              <label htmlFor='title'>Title</label>
              <input type='text' id='title' name='title' placeholder='Title' required/><br></br>
              <label htmlFor='content'>Content</label>
              <textarea type='text' id='content' name='content' maxLength="200" placeholder='Content' required/><br></br>
              <label htmlFor='attachment'>Attachment</label>
              <input type='file' id='attachment' name='attachment' required/><br></br>
              <button className='submit' type='submit' value='Submit' disabled={disabledButton}>Create</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default CreateDiscussion;