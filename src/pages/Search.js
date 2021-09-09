import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import '../styles/css/search.css';

// Search results
const Search = () => {
  const { keyword }  = useParams();
  const [listTags, setListTags] = useState([]);

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

  const getOldSearch = () => {
    let array = JSON.parse(localStorage.getItem('search-history'));
    array.reverse();
    return array;
  };

  // Make one list HTML tag
  const makeList = (result, index) => {
    return (
      <li key={index}>
        <Link to={"/search/" + result}>{result}</Link>
      </li>
    );
  };

  const createList = async () => {
    runLocalstorage();
    let array = getOldSearch();
    let container = [];

    array.forEach((result, index) => {
      let list =  makeList(result, index);
      container.push(list);
    });
    setListTags(container);
  };


  useEffect(() => {
    createList();
  }, [keyword]);

  return (
    <section className='search-result-page'>
      <div className='search-history'>
        <ul>
          {listTags.map((li) => {
            return (
              li
            );
          })}
        </ul>
      </div>

      <div className="titles">
        <h1>Title</h1>
      </div>

      <div className="user">
        <h1>User</h1>
      </div>
    </section>
  );
};

export default Search;
