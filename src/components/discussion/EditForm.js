import React from 'react';

const EditForm = (props) => {
  const { content } = props;

  return (
    <form className='edit-discussion'>
      <fieldset>
        <textarea type='text' id='content' name='content' maxLength="200" value={content} required/><br></br>
        <label htmlFor='attachment'>Attachment</label>
        <input type='file' id='attachment' name='attachment'/><br></br>
      </fieldset>
      <fieldset>
        <button type='button'>Submit</button>
        <button type='button'>cancel</button>
      </fieldset>
    </form>
  );
};

export default EditForm;
