import React, { useState, useEffect } from 'react';
import Firebase from '../../config/Firebase';
import Default from '../../assets/default-icon.jpg';
import handleFirebaseError from '../../components/error/FirebaseError';

const Icon = (props) => {
  const [iconURL, setIconURL] = useState("");
  const [loading, setloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const { uid } = props;

  // Show icon
  const showIcon = async () => {
    let imgURL = Default;

    try {
      imgURL = 
        await Firebase
          .storage()
          .ref("user-icon/" + uid + "/icon.jpg")
          .getDownloadURL();
    } catch (error) {
      setErrorMessage(handleFirebaseError(error));
    }

    setIconURL(imgURL);
    setloading(false);
  };

  // Upload icon to Storage
  const uploadIcon = async (event) => {
    const file = event.target.files[0];
    setloading(true);

    try {
      await Firebase
        .storage()
        .ref("user-icon/" + uid + "/icon.jpg")
        .put(file);
    } catch (error) {
      alert(error);
    }

    showIcon();
  };

  // Load once
  useEffect(() => {
    showIcon();
  },[]);
  
  return (
    <div className="profile-icon">
      <img src={iconURL}  width="100px" />
      <span hidden={!loading}>...Loading...</span>
      <input onChange={uploadIcon} type='file' name="icon"/>
      <h2>{errorMessage}</h2>
    </div>
  );
};

export default Icon;