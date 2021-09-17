import React from 'react';
import ReactCountryFlag from 'react-country-flag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

const ShowInfo = (props) => {
  const { nickname, gender, nation } = props;

  const showGender = () => {
    if(gender === 'male') {
      return (
        <FontAwesomeIcon icon={faMars} color='cornflowerblue' size='lg' />
      );
    } else {
      return (
        <FontAwesomeIcon icon={faVenus} color='crimson' size='lg' />
      );
    }
  };

  return (
    <div className='upper-info'>
      <ReactCountryFlag countryCode={nation} style={{ fontSize: '2rem' }} className='nation' svg/>
      <h2>{nickname}</h2>
      {showGender()}
   </div>
  );
};

export default ShowInfo;