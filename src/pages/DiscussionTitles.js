import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import FirebasePack from '../config/FirebasePack';
import FilterButtons from '../components/discussion-titles/FilterButtons';
import CreateDiscussion from '../components/discussion-titles/CreateDiscussion';
import DiscussionsList from '../components/discussion-titles/DiscussionsList';
import '../styles/css/discussion-titles.css';

const DiscussionTitles = () => {
  const { t } = useTranslation('discussion');
  const { optionalGroup }  = useParams();
  const { currentUser } = useContext(AuthContext);
  const [formHidden, setFormHidden] = useState('hidden');
  const [GroupsDoc, setGroupsDoc] = useState([]);
  const [hasDiscussionsDocs, setHasDiscussionsDocs] = useState(true);
  const [discussionsDocs, setDiscussionsDocs] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  // Check if jumped from groups page
  const checkParam = () => {
    if (optionalGroup === '00') {
      setSelectedGroups([]);
    } else {
      setSelectedGroups([optionalGroup]);
    }
  };

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
    if (container.length === 0 ) {
      setHasDiscussionsDocs(false);
    } else {
      setDiscussionsDocs(container);
    }
  };

  const fetchDiscussions = async () => {
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
    setFormHidden('hidden');
  };
  
  useEffect(() => {
    checkParam();
    fetchDiscussions();
  },[]);

  return (
    <section className='discussions-page'>
      <div className='discussions-container'>
        <header>
          <div className='discussions-controller'>
            <FilterButtons documents={GroupsDoc}  updateSelection={updateSelection} cancelSelection={cancelSelection} allSelection={allSelection} optionalGroup={optionalGroup} />
            {currentUser
                ? <div id='toggle-display'><button onClick={switchHidden}>{t('content.create-discussion')}</button></div>
                : <div></div>
            }
          </div>
          {currentUser
            ?
              <CreateDiscussion currentUser={currentUser} hidden={formHidden} switchHidden={switchHidden} update={fetchDiscussions} />
            :
              <div></div>
          }
        </header>
        {hasDiscussionsDocs
          ?
            <DiscussionsList documents={discussionsDocs} selectedGroups={selectedGroups} />
          :
            <div></div>
          }
      </div>
    </section>
  );
};

export default DiscussionTitles;
