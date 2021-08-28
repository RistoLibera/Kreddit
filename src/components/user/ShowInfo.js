import React, { useState, useEffect } from 'react';
import Firebase from '../../config/Firebase';
import ReactCountryFlag from 'react-country-flag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

const ShowInfo = (props) => {
  const { uid } = props;
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [nation, setNation] = useState("");
  let info;

  const getInfo = async () => {
    try {
      let cache = 
        await Firebase
          .firestore()
          .collection('user-info')
          .doc(uid)
          .get();
      info = cache.data();
    } catch (error) {
      alert(error);
    }

    setNickname(info.nickname);
    setGender(info.gender);
    setNation(info.nation);
  };

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

  // Load once
  useEffect(() => {
    getInfo();
  },[]);

  return (
    <div className='upper-info'>
      {showGender()}
      <h2>{nickname}</h2>
      <ReactCountryFlag countryCode={nation} style={{ fontSize: '2rem' }} />
    </div>
  );
};

export default ShowInfo;