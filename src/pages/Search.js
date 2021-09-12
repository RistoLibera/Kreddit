import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import FirebasePack from '../config/FirebasePack';
import { useParams } from 'react-router-dom';
import '../styles/css/search.css';

// Search results
const Search = () => {
  const { t } = useTranslation('search');
  const { keyword }  = useParams();
  const [searchListTags, setSearchListTags] = useState([]);
  const [userListTags, setUserListTags] = useState([]);
  const [titleListTags, setTitleListTags] = useState([]);

  // Record on localstorage
  const runLocalstorage = () => {
    if (!localStorage.getItem('search-history')) {
      let searchHistory = [];
      searchHistory.push(keyword);
      localStorage.setItem('search-history', JSON.stringify(searchHistory));
    } else {
      let searchHistory = JSON.parse(localStorage.getItem('search-history'));
      if (searchHistory.some((word) => word === keyword)) {
        return;
      } else if (searchHistory.length > 4) {
        searchHistory.shift();
        searchHistory.push(keyword);
        localStorage.setItem('search-history', JSON.stringify(searchHistory));  
      } else {
        searchHistory.push(keyword);
        localStorage.setItem('search-history', JSON.stringify(searchHistory));  
      }
    }
  };

  // Get words array
  const getOldSearch = () => {
    let array = JSON.parse(localStorage.getItem('search-history'));
    array.reverse();
    return array;
  };

  // Delete one search result
  const deleteThis = (result, index) => {
    let searchHistory = JSON.parse(localStorage.getItem('search-history'));
    let newArray = searchHistory.filter((word) => word !== result);
    localStorage.setItem('search-history', JSON.stringify(newArray));  
    let list = document.getElementById(index);
    list.remove();
  };

  // Make one search list HTML tag
  const makeSearchList = (result, index) => {
    return (
      <li key={index} id={index}>
        <Link to={"/search/" + result}>{result}</Link>
        <button className='delete-history' onClick={() => deleteThis(result, index)}>X</button>
      </li>
    );
  };

  const createSearchList = () => {
    runLocalstorage();
    let array = getOldSearch();
    let container = [];

    array.forEach((result, index) => {
      let list =  makeSearchList(result, index);
      container.push(list);
    });
    setSearchListTags(container);
  };

  // Get users data
  const getUserData = async () => {
    let userInfos = [];
    try {
      await FirebasePack
        .firestore()
        .collection('user-info')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let info = {
              name: doc.data().nickname,
              uid: doc.id         
            };
            userInfos.push(info);
          });
        });
      } catch (error) {
      console.log(error);
    }
    return userInfos;
  };

  // Make one user list HTML tag
  const makeUserList = (name, uid, index) => {
    return (
      <li key={index}>
        <Link to={"/profile/" + uid}>{name}</Link>
      </li>
    );
  };

  // Get users result
  const createUserList = async () => {
    let userInfos = await getUserData();
    let result = userInfos.filter((info) => info.name.toLowerCase().includes(keyword.toLowerCase()));
    let container = [];

    result.forEach((info, index) => {
      let list =  makeUserList(info.name, info.uid, index);
      container.push(list);
    });
    setUserListTags(container);
  };

  // Get titles groups
  const getTitleGroup = async () => {
    let groupDocs = [];
    try {
      await FirebasePack
        .firestore()
        .collection('groups')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            groupDocs.push(doc);
          });
        });
      } catch (error) {
      console.log(error);
    }
    return groupDocs;
  };

  // Get titles data
  const getTitleData = async (groupDocs) => {
    if (!groupDocs) return;
    let discussionDocs = [];
    for (const [index, doc] of groupDocs.entries()) {
      try {
        await doc
          .ref
          .collection('discussions')
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              discussionDocs.push(doc);
            });
          });
        } catch (error) {
        console.log(error);
      }
    }
    return discussionDocs;
  };

  // Make one title list HTML tag
  const makeTitleList = (title, group, uid, index) => {
    return (
      <li key={index}>
        <Link to={"/discussions/" + group + '/' + uid}>{title} in <b style={{ fontWeight: 800}}>{group}</b></Link>
      </li>
    );
  };

  // Get titles result
  const createTitleList = async () => {
    let groupDocs = await getTitleGroup();
    let discussionDocs = await getTitleData(groupDocs);
    let result = discussionDocs.filter((doc) => doc.data().title.toLowerCase().includes(keyword.toLowerCase()));
    let container = [];

    result.forEach((doc, index) => {
      let data = doc.data();
      let list =  makeTitleList(data.title, data.group_name, data.discussion_uid, index);
      container.push(list);
    });
    setTitleListTags(container);
  };

  // Get all result
  const createResult = async () => {
    await createUserList();
    await createTitleList();
  };

  useEffect(() => {
    createSearchList();
    createResult();
  }, [keyword]);

  return (
    <section className='search-result-page'>
      <div className='search-history'>
        <h2>{t('content.search-history')}</h2>
        <ul>
          {searchListTags.map((li) => {
            return (
              li
            );
          })}
        </ul>
      </div>

      <div className="titles">
        <h2>{t('content.title')}</h2>
        <ul>
          {titleListTags.map((li) => {
              return (
                li
              );
          })}
        </ul>
      </div>

      <div className="users">
        <h2>{t('content.user')}</h2>
        <ul>
          {userListTags.map((li) => {
              return (
                li
              );
          })}
        </ul>
      </div>
    </section>
  );
};

export default Search;
