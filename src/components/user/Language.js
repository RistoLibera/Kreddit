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
      <button className="dropdown-items" onClick={() => changeLanguage("en")}>{t('content.english')}</button>
      <button className="dropdown-items" onClick={() => changeLanguage("jp")}>{t('content.japanese')}</button>

    </div>
  );
};

export default Language;