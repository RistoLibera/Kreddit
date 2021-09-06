import React, { useState, useEffect } from 'react';
import '../styles/css/search.css';
// Search results
const Search = () => {
  const [indicator, setIndicator] = useState(1);
  
  const screw = () => {
    setIndicator(2);
  };

  const test = () => {
    return(
      <div className='test'>
        <h1>{indicator}</h1>
      </div>
    );
  };

  useEffect(() => {
    screw();
  }, []);

  return (
    <section className='search-result-page'>
      {test()}
    </section>
  );
};

export default Search;
