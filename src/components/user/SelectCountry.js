import React from 'react';
import CountryData from '../../assets/data/country-data';

const SelectCountry = () => {
  let optionTAB = [];

  const createList = () => {
    let countryName;
    let countryCode;
    let option;

    CountryData.forEach((data, index) => {
      countryName = data["country_name"];
      countryCode = data["country_code"];
      option = <option key={index} value={countryCode}>{countryName}</option>;
      optionTAB.push(option);    
    });

    return (
      <select name="nation" id="nation">
        {optionTAB.map((option) => {
          return (
            option
          );
        })}
      </select>
    );
  };

  return (
    <div className="all-nations">
      {createList()}
    </div>
  );
};

export default SelectCountry;