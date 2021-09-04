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
      let discussionCache = await doc.ref.collection('discussions').get();    
      if (discussionCache) {
        discussionCache.forEach((doc) => {
          container.push(doc);
        });   
      }
    }
    setDiscussionsDocs(container);
  };

  const fetchDiscussions = async () => {
    try {
      let groupCache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .orderBy("created_time", "asc")
          .get();
      storeGroups(groupCache);
      storeDiscussions(groupCache);
    } catch (error) {
      console.log(error);
    }
    switchHidden();
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
            <CreateDiscussion user={currentUser} hidden={formHidden} update={fetchDiscussions} />
          </header>
          <DiscussionList documents={discussionsDocs} selectedGroups={selectedGroups} />
        </div>
      }
    </section>
  );
};

export default Discussions;
