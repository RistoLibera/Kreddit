import React from 'react';
import { useTranslation } from "react-i18next";

const Language = () => {
  const { t, i18n } = useTranslation('header');
 
  // Change language
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className='language-buttons dropdown-items'>
      <button onClick={() => changeLanguage("en")}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {t('content.english')}
        </button>
      <button onClick={() => changeLanguage("jp")}>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        {t('content.japanese')}
        </button>
    </div>
  );
};

export default Language;