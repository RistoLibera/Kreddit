import React, { useState, useEffect }  from 'react';
import { css } from '@emotion/react';
import BarLoader from 'react-spinners/BarLoader';

const ReplyForm = (props) => {
  const { user, hidden, rootUpdate } = props;
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(false);

//  layer-structure  subdiscussions
//  replied by  layer + 1  by uid

  const handleReply = () => {

  };

  return (
    <div className={hidden}>
      {pageLoading
        ?
          <div className='page-loader'>
            <BarLoader color='#D5D736' css={spinnerCSS} size={150} />
          </div>
        :
          <form onSubmit={handleReply}>
            <fieldset>
              <textarea type='text' id='content' name='content' maxLength="200" placeholder='Content' required/><br></br>
              <button className='submit' type='submit' value='Submit'>Create</button>
            </fieldset>
          </form>
      }
    </div>
  );
};

export default ReplyForm;
