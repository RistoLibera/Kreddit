import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import '../styles/css/search.css';

// Search results
const Search = () => {
  const { keyword }  = useParams();

  const runLocalstorage = () => {
    if (localStorage.length === 0) {
      let searchHistory = [];
      searchHistory.push(keyword);
      localStorage.setItem('search-history', JSON.stringify(searchHistory));
    } else {
      let searchHistory = JSON.parse(localStorage.getItem('search-history'));
      searchHistory.push(keyword);
      localStorage.setItem('search-history', JSON.stringify(searchHistory));
    }
    console.log(localStorage);
  };


  useEffect(() => {
    runLocalstorage();
  }, [keyword]);

  return (
    <section className='search-result-page'>
      <div className='search-history'>
        <h1>history</h1>
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
