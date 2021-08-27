import React from 'react';
import CountryData from '../../assets/data/country-data';

const SelectCountry = () => {
  console.log(CountryData)

  return (
    <div className="nations">
      <select name="nation" id="nation">
        
      </select>
    </div>
  )
};

export default SelectCountry;