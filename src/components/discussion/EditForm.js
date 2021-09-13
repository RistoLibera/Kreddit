import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const EditForm = (props) => {
  const { t } = useTranslation('edit');
  const { content, title, document, parentLayer, rootUpdate, toggleEdit } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);
  const [layerClass, setLayerClass] =useState('');

  // Adjust block width
  const makeLayerClass = () => {
    let className = 'edit-layer-' + parentLayer; 
    setLayerClass(className);
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
      let attachmentValue = attachment.files[0];
      if (contentValue !== content) await updateContent(contentValue);
      if (attachmentValue !== undefined && parentLayer === 0) await updateImg(attachmentValue);  
    } else {
      const { content } = event.target.elements;
      let contentValue = content.value;
      if (contentValue !== content) await updateContent(contentValue);
    }
    setPageLoading(false);
    rootUpdate();
    toggleEdit();
  };

  useEffect(() => {
    makeLayerClass();
  }, []);

  return (
    <div className='edit-form-block'>
      <div className={layerClass}>
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
                    <fieldset>
                      <textarea type='text' id='content' name='content' maxLength="200" defaultValue={content} placeholder={t('content.content-holder')} required/><br></br>
                      <label htmlFor='attachment'>{t('content.attachment')}</label>
                      <input type='file' id='attachment' name='attachment'/><br></br>
                      <button type='submit' value='Submit'>{t('content.submit')}</button>
                    </fieldset>
                  </form>
                :
                  <form className='edit-discussion' onSubmit={handleEdit}>
                    <fieldset>
                      <textarea type='text' id='content' name='content' maxLength="200" defaultValue={content} placeholder={t('content.content-holder')} required/><br></br>
                      <button type='submit' value='Submit'>{t('content.submit')}</button>
                    </fieldset>
                  </form>
              }
            </div>
        }
      </div>
    </div>
  );
};

export default EditForm;
