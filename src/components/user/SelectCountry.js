import React from 'react';
import CountryData from '../../assets/data/country-data';

const SelectCountry = () => {
  let optionTag = [];

  const createList = () => {
    let countryName;
    let countryCode;
    let option;

    CountryData.forEach((data, index) => {
      countryName = data['country_name'];
      countryCode = data['country_code'];
      option = <option key={index} value={countryCode}>{countryName}</option>;
      optionTag.push(option);    
    });

    return (
      <select name='nation' id='nation'>
        {optionTag.map((option) => {
          return (
            option
          );
        })}
      </select>
    );
  };

  return (
    <div className='all-nations'>
      {createList()}
    </div>
  );
};

export default SelectCountry;