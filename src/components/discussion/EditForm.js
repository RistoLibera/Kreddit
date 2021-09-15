import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const EditForm = (props) => {
  const { t } = useTranslation('edit');
  const { hidden, height, content, title, document, parentLayer, rootUpdate, toggleEdit } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  // Adjust textarea height
  const adjustHeight = (event) => {
    const textareaHTML = event.target;
    textareaHTML.style.height = "auto";
    textareaHTML.style.height = (textareaHTML.scrollHeight) + "px";
  };

  // Update content
  const updateContent = async (content) => {
    try {
      await document
        .ref
        .update({
          content: content
        });
      } catch (error) {
      console.log(error);
    }
  };

  // Update img
  const updateImg = async (img) => {
    if (!img) return;
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
    if (parentLayer === 0) {
      const { content, attachment} = event.target.elements;
      let contentValue = content.value;
      setEditedContent(contentValue);
      let attachmentValue = attachment.files[0];
      if (contentValue !== content) await updateContent(contentValue);
      if (attachmentValue !== undefined && parentLayer === 0) await updateImg(attachmentValue);  
    } else {
      const { content } = event.target.elements;
      let contentValue = content.value;
      setEditedContent(contentValue);
      if (contentValue !== content) await updateContent(contentValue);
    }
    setPageLoading(false);
    toggleEdit();
    rootUpdate();
  };

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  return (
    <div className={hidden}>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <div className='ternary'>
            {parentLayer === 0
              ?
                <form className='edit-discussion' onSubmit={handleEdit}>
                  <fieldset className='modify-text'>
                    <textarea onChange={adjustHeight} style={{ height: height }} type='text' id='content' name='content' maxLength="500" defaultValue={editedContent} placeholder={t('content.content-holder')} required/>
                  </fieldset>

                  <fieldset className='upload'>
                    <label id="img" htmlFor='files'>{t('content.attachment')}</label>
                    <input type='file' id='files' name='attachment'/><br></br>
                    <button type='submit' value='Submit'>{t('content.submit')}</button>
                  </fieldset>
                </form>
              :
                <form className='edit-subdiscussion' onSubmit={handleEdit}>
                  <fieldset className='modify-sub-text'>
                    <textarea onChange={adjustHeight} style={{ height: height }} type='text' id='content' name='content' maxLength="500" defaultValue={editedContent} placeholder={t('content.content-holder')} required/>
                    <button type='submit' value='Submit'>{t('content.submit')}</button>
                  </fieldset>
                </form>
            }
          </div>
      }
    </div>
  );
};

export default EditForm;
