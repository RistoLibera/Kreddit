import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import firebase from 'firebase/app';
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
  const [pageLoading, setPageLoading] = useState(true);
  const [discussionsDocs, setDiscussionsDocs] = useState([]);

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };

  // Store discussions
  const storeDiscussions = async (groupCache) => {
    let container = [];
    for (const doc of groupCache.docs) {
      console.log(doc.data().name);
      let discussionCache = await doc.ref.collection('discussions').doc().get();    
      container.push(discussionCache);
    }
    setDiscussionsDocs(container);
  };

  // push button => refresh and refetch
  //  update(name array)
  // Fetch newest discussion details
  const fetchDiscussions = async () => {
    try {
      let groupCache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .orderBy("created_time", "asc")
          .get();
      storeDiscussions(groupCache);
    } catch (error) {
      console.log(error);
    }
    setPageLoading(false);
  };
  
  useEffect(() => {
    fetchDiscussions();
  },[]);

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
            <CreateDiscussion user={currentUser} hidden={formHidden} update={fetchDiscussions}/>
          </header>
          <DiscussionList document={discussionsDocs} user={currentUser}/>
        </div>
      }
    </section>
  );
};

export default Discussions;
