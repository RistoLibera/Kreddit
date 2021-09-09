import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Search results
const Search = () => {


  return (
    <section className='search-bar'>
      <form>
        <FontAwesomeIcon icon={faSearch} color='' size='2x' />
        <input type='text' placeholder="Let's kreddit!"></input>
        <button type='submit' value='Submit'>Search</button>
      </form>
    </section>
  );
};

export default Search;
