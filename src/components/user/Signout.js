import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import FirebasePack from '../../config/FirebasePack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff } from '@fortawesome/free-solid-svg-icons';

const Signout = () => {
  const { t } = useTranslation('header');
  const history = useHistory();
  const proceedSignout = () => {
    FirebasePack.auth().signOut();
    // Clear search result
    localStorage.clear();
    history.push('/');
  };

  return (
    <button id='signout' className="dropdown-items" onClick={proceedSignout}  type='button'>
      <FontAwesomeIcon icon={faPowerOff} color='' size='2x' />
      <span>{t('content.signout')}</span>
    </button>
  );
};

export default Signout;
