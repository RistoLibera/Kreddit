import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Search results
const Search = () => {
  const history = useHistory();

  const jumpToSearchPage = (event) => {
    event.preventDefault();
    const { keyword } = event.target.elements;
    history.push('/search/' + keyword.value);
  };

  return (
    <section className='search-bar'>
      <form onSubmit={jumpToSearchPage}>
        <FontAwesomeIcon icon={faSearch} color='' size='2x' />
        <input type='text' id='keyword' name='keyword' placeholder="Let's kreddit!" maxLength='15'></input>
        <button type='submit' value='Submit'>Search</button>
      </form>
    </section>
  );
};

export default Search;
