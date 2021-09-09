import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import { useParams } from 'react-router-dom';
import '../styles/css/search.css';

// Search results
const Search = () => {
  const { keyword }  = useParams();
  const [searchListTags, setSearchListTags] = useState([]);
  const [userListTags, setUserListTags] = useState([]);
  const [titleListTags, setTitleListTags] = useState([]);

  // Record on localstorage
  const runLocalstorage = () => {
    if (localStorage.length === 0) {
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
        <button onClick={() => deleteThis(result, index)}>X</button>
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

  // Get users
  const createUserList = async () => {
    let userInfos = await getUserData();
    let result = userInfos.filter((info) => info.name.includes(keyword));
    let container = [];

    result.forEach((info, index) => {
      let list =  makeUserList(info.name, info.uid, index);
      container.push(list);
    });
    setUserListTags(container);
  };


  // Get titles  group title uid
  const createTitleList = async () => {

  };


  useEffect(() => {
    createSearchList();
    createUserList();
  }, [keyword]);

  return (
    <section className='search-result-page'>
      <div className='search-history'>
        <ul>
          {searchListTags.map((li) => {
            return (
              li
            );
          })}
        </ul>
      </div>

      <div className="titles">
        <ul>
          {userListTags.map((li) => {
              return (
                li
              );
          })}
        </ul>
      </div>

      <div className="user">
        <ul>
          {titleListTags.map((li) => {
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
