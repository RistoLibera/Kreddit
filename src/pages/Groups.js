import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import { useTranslation } from "react-i18next";
import FirebasePack from '../config/FirebasePack';
import CreateGroup from '../components/groups/CreateGroup';
import GroupList from '../components/groups/GroupList';
import '../styles/css/groups.css';

const Groups = () => {
  const { t } = useTranslation('group');
  const { currentUser } = useContext(AuthContext);
  const [formHidden, setFormHidden] = useState("hidden");
  const [hasGroupsDoc, setHasGroupsDoc] = useState(true);
  const [GroupsDoc, setGroupsDoc] = useState([]);
  const [groupView, setGroupView] = useState('list-view');

  // Change groups display
  const changeView = () => {
    if (groupView === 'grid-view') {
      setGroupView('list-view');
    } else {
      setGroupView('grid-view');
    }
  };

  // Toggle groups view
  const toggleView = (event) => {
    const btn = event.target.closest('.grid-list');
    btn.classList.add('animation');
    btn.classList.toggle('active');
    changeView();
  };

  const switchHidden = () => {
    if (formHidden === 'hidden') {
      setFormHidden('form-container');
    } else {
      setFormHidden('hidden');
    }
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

  // Fetch newest group details
  const fetchGroups = async () => {
    try {
      let cache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .orderBy("created_time", "asc")
          .get();
      if(cache.docs.length === 0) {
        setHasGroupsDoc(false);
      } else {
        storeGroups(cache);
      }
    } catch (error) {
      console.log(error);
    }
    setFormHidden('hidden');
  };

  useEffect(() => {
    fetchGroups();
  },[]);

  return (
    <section className='groups-page'>
      <div className='group-container'>
        <header>
          <div className='group-controller'>
            <button className="grid-list animation active" onClick={toggleView}>
              <div className="icon">
                <div className="dots">
                  <i></i><i></i><i></i><i></i>
                </div>
                <div className="lines">
                  <i></i><i></i><i></i><i></i>
                </div>
              </div>
              <div className="text">
                <span>Grid</span>
                <span>List</span>
              </div>
            </button>

            {currentUser
              ? <button onClick={switchHidden} className='display-control' >{t('content.create-group')}</button>
              : <div></div>
            }
          </div>
          <CreateGroup documents={GroupsDoc} currentUser={currentUser} hidden={formHidden} update={fetchGroups} />
        </header>
        {hasGroupsDoc
          ?
            <GroupList documents={GroupsDoc} currentUser={currentUser} groupView={groupView} update={fetchGroups}/>
          :
            <div></div>
        }
      </div>
    </section>
  );
};

export default Groups;
