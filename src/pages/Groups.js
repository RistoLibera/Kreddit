import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import CreateGroup from '../components/groups/CreateGroup';
import GroupList from '../components/groups/GroupList';

const Groups = () => {
  const { currentUser } = useContext(AuthContext);
  const spinnerCSS = css`
  display: block;
  margin: 0 auto;
  border-color: red;
  `;
  const [formHidden, setFormHidden] = useState("hidden");
  const [pageLoading, setPageLoading] = useState(true);
  const [GroupsDoc, setGroupsDoc] = useState([]);

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
      storeGroups(cache);
    } catch (error) {
      console.log(error);
    }
    switchHidden();
    setPageLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  },[]);

  return (
    <section className='groups-page'>
      {pageLoading 
        ?
          <div className='page-loader'>
            <ClimbingBoxLoader color='#D5D736' css={spinnerCSS} size={50} />
          </div>
        :
          <div className='group-container'>
            <header>
              <div className='group-controller'>
                <div>
                  <p>many-grid</p>
                  <p>two-grid</p>
                </div>
                {currentUser
                  ? <button onClick={switchHidden}>Create a group</button>
                  : <div></div>
                }
              </div>
              <CreateGroup documents={GroupsDoc} user={currentUser} hidden={formHidden} update={fetchGroups} />
            </header>
            <GroupList documents={GroupsDoc} user={currentUser} />
          </div>
      }
    </section>
  );
};

export default Groups;
