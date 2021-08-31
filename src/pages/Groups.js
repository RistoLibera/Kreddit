import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../components/loading/Auth';
import FirebasePack from '../config/FirebasePack';
import firebase from 'firebase/app';
import { css } from '@emotion/react';
import ClimbingBoxLoader from 'react-spinners/ClimbingBoxLoader';
import Default from '../assets/img/default-symbol.png';
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
  const [createdGroupsDoc, setCreatedGroupsDoc] = useState([]);
  const [groupDetails, setGroupDetails] = useState([]);

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
    setCreatedGroupsDoc(container);
  };

  // Fetch newest group details
  const fetchGroups = async () => {
    try {
      let cache =
        await FirebasePack
          .firestore()
          .collection('groups')
          .get();
        storeGroups(cache);
    } catch (error) {
      console.log(error.code);
    }
    setPageLoading(false);
  };


  // Get group symbol
  const getSymbol = async (name) => {
    let symbolURL = Default;
    try {
      symbolURL = 
        await FirebasePack
          .storage()
          .ref('group-symbol/' + name + '/symbol.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error.code);
    }
    return symbolURL;
  };


  // Decypher group details
  const decypherDetails = async () => {
    // let name;
    // let creator;
    // let introduction;
    // let symbolURL;
    await fetchGroups();


    // try {
    //   let symbolURL = 
    //     await FirebasePack
    //       .storage()
    //       .ref('group-symbol')
    //       .listAll() ;
    //   console.log(symbolURL);
    // } catch (error) {
    //   console.log(error.code);
    // }


    // setGroupDetails();
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
            <div className='create-group'>
              <header>
                {currentUser 
                ? 
                  <div>
                    <h2>You can create at most three groups</h2>
                    <button onClick={switchHidden}>Create a group</button>
                  </div>
                : 
                  <div></div>
                }
              </header>

              <CreateGroup document={createdGroupsDoc} user={currentUser} hidden={formHidden} update={fetchGroups} />
            </div>

            {/* <GroupList documents={createdGroupsDoc} /> */}
          </div>
      }
    </section>
  );
};

export default Groups;
