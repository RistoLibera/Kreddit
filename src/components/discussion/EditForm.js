import React, { useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const EditForm = (props) => {
  const { groupUID, content, title, document, rootUpdate, toggleEdit } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);

  // Update content
  const updateContent = async (content) => {
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .doc(groupUID)
        .collection('discussions')
        .doc(document.id)
        .update({
          content: content
        });
      } catch (error) {
      console.log(error);
    }
  };

  // Update img
  const updateImg = async (img) => {
    try {
      await FirebasePack
        .storage()
        .ref('discussion-title-image/' + title + '/img.jpg')
        .put(img);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    setPageLoading(true);
    const { content, attachment} = event.target.elements;
    let contentValue = content.value;
    let attachmentValue = attachment.files[0];
    if (contentValue !== content) await updateContent(contentValue);
    if (attachmentValue) await updateImg(attachmentValue);
    toggleEdit();
    setPageLoading(false);
    rootUpdate();
  };

  return (
    <div className='edit-form-block'>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <form className='edit-discussion' onSubmit={handleEdit}>
            <fieldset>
              <textarea type='text' id='content' name='content' maxLength="200" defaultValue={content} required/><br></br>
              <label htmlFor='attachment'>Attachment</label>
              <input type='file' id='attachment' name='attachment'/><br></br>
              <button type='submit' value='Submit'>Submit</button>
              <button type='button'>cancel</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default EditForm;
