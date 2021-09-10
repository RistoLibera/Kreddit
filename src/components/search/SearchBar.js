import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// Search results
const Search = () => {
  const { t } = useTranslation('header');
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
        <input type='text' id='keyword' name='keyword' placeholder={t('content.search-holder')} maxLength='15'></input>
        <button type='submit' value='Submit'>{t('content.search-button')}</button>
      </form>
    </section>
  );
};

export default Search;
