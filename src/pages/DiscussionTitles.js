import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import FilterButtons from '../components/discussion-titles/FilterButtons';
import CreateDiscussion from '../components/discussion-titles/CreateDiscussion';
import DiscussionsList from '../components/discussion-titles/DiscussionsList';
import '../styles/css/discussion-titles.css';

const DiscussionTitles = () => {
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [formHidden, setFormHidden] = useState('hidden');
  const [pageLoading, setPageLoading] = useState(true);
  const [GroupsDoc, setGroupsDoc] = useState([]);
  const [discussionsDocs, setDiscussionsDocs] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
  };

  // Selection to all by default
  const allSelection = () => {
    setSelectedGroups([]);
  };

  // Selection by group
  const updateSelection = (groupName) => {
    setSelectedGroups(preArray => [...preArray, groupName]);
  };

  // Cancel selection
  const cancelSelection = (groupName) => {
    setSelectedGroups(preArray => preArray.filter((name) => name !== groupName));
  };  

  // Store groups
  const storeGroups = (cache) => {
    let container = [];
    if (cache) {
      cache.forEach((doc) => {
        container.push(doc);
      });   
    }
    setGroupsDoc(container);
  };

  // Store discussions
  const storeDiscussions = async (groupCache) => {
    let container = [];
    for (const doc of groupCache.docs) {
      let discussionCache = await doc.ref.collection('discussions').orderBy("created_time", "desc").get();    
      if (discussionCache) {
        discussionCache.forEach((doc) => {
          container.push(doc);
        });   
      }
    }
    setDiscussionsDocs(container);
  };

  const fetchDiscussions = async () => {
    setPageLoading(true);
    try {
      let groupCache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .orderBy("created_time", "desc")
          .get();
      storeGroups(groupCache);
      await storeDiscussions(groupCache);
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
              <FilterButtons documents={GroupsDoc}  updateSelection={updateSelection} cancelSelection={cancelSelection} allSelection={allSelection} />
              {currentUser
                  ? <button onClick={switchHidden}>Create a discussion</button>
                  : <div></div>
              }
            </div>
            {currentUser
              ?
                <CreateDiscussion user={currentUser} hidden={formHidden} update={fetchDiscussions} />
              :
                <div></div>
            }
          </header>
          <DiscussionsList documents={discussionsDocs} selectedGroups={selectedGroups} />
        </div>
      }
    </section>
  );
};

export default DiscussionTitles;
