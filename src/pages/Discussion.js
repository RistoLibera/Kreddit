import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';

//  embed uid into reply and rate

const Discussion = () => {
  const { uid }  = useParams();
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [pageLoading, setPageLoading] = useState(true);


  const fetchThisDiscussion = async () => {
    setPageLoading(true);

    setPageLoading(false);
  };
  
  useEffect(() => {
    fetchThisDiscussion();
  },[]);


  return (
    <section className='search-result-page'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
        <div className='discussions-container'>

        </div>
      }
    </section>
  );
};

export default Discussion;
