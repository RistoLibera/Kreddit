import React, { useState, useEffect } from 'react';
import Firebase from '../../config/Firebase';
import ReactCountryFlag from 'react-country-flag';

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

  // Load once
  useEffect(() => {
    getInfo();
  },[]);

  return (
    <div className='upper-info'>
      <h2>{gender}</h2>
      <h2>{nickname}</h2>
      <ReactCountryFlag countryCode={nation} />
    </div>
  );
};

export default ShowInfo;