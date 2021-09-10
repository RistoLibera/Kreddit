import React from 'react';
import { useTranslation } from "react-i18next";

const Language = () => {
  const { i18n } = useTranslation('header');
 
  // Change language
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className='language-buttons dropdown-items'>
      <button className="dropdown-items" onClick={() => changeLanguage("en")}>EN</button>
      <button className="dropdown-items" onClick={() => changeLanguage("jp")}>JP</button>

    </div>
  );
};

export default Language;