import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

const ShowInfo = (props) => {
  const { nickname, gender, nation } = props;

  const showGender = () => {
    if(gender === 'male') {
      return (
        <FontAwesomeIcon icon={faMars} color="cornflowerblue" size="lg" />
      );
    } else if (gender === 'female') {
      return (
        <FontAwesomeIcon icon={faVenus} color="crimson" size="lg" />
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  };

  return (
    <div className='upper-info'>
      {showGender()}
      <h2>{nickname}</h2>
      <ReactCountryFlag countryCode={nation} style={{ fontSize: '2rem' }} />
    </div>
  );
};

export default ShowInfo;