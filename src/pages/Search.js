import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FirebasePack from '../config/FirebasePack';
import '../styles/css/search.css';

// Search results
const Search = () => {
  const { keyword }  = useParams();
  const [indicator, setIndicator] = useState(1);
  

  return (
    <section className='search-result-page'>
      <h2>letttt</h2>
    </section>
  );
};

export default Search;
