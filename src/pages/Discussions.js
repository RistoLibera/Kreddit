import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import FilterButtons from '../components/discussion/FilterButtons';
import CreateDiscussion from '../components/discussion/CreateDiscussion';
import DiscussionList from '../components/discussion/DiscussionList';

const Discussions = () => {
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [formHidden, setFormHidden] = useState("hidden");
  const [pageLoading, setPageLoading] = useState(false);
  const [CreatedTitles, setCreatedTitles] = useState([]);

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };

  return (
    <section className='discussions-page'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
        <div className='discussions-container'>
          <header>
            <div className='discussions-controller'>
              <FilterButtons />
              {currentUser
                  ? <button onClick={switchHidden}>Create a discussion</button>
                  : <div></div>
              }
            </div>
            <CreateDiscussion user={currentUser} hidden={formHidden} />
          </header>
          <DiscussionList />
        </div>
      }
    </section>
  );
};

export default Discussions;
