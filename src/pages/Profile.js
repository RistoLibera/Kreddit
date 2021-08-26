import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { AuthContext } from '../components/user/Auth';
import Firebase from '../config/Firebase';
import '../styles/css/profile.css';

const Profile = () => {
  const [iconURL, setIconURL] = useState("");
  const [loading, setloading] = useState(false);
  // const [nickname, setNickname] = useState("");
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();
  // Use complex user UID to avoid malice
  const { uid }  = useParams();

  // Show icon
  const showIcon = async () => {
    let imgURL;

    try {
      imgURL = 
        await Firebase
          .storage()
          .ref("user-icon/" + uid + "/icon.jpg")
          .getDownloadURL();
    } catch (error) {
      alert(error);
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

  // // Nickname
  // const showNickname = async () => {
  //   let test
  //   try {
  //     test = 
  //       await Firebase
  //         .auth()
  //         .getUser(uid)

  //   } catch (error) {
  //     alert(error);
  //   }

  //   // slice 0 -9
  //   console.log(test)

  // }

  // Load once
  useEffect(() => {
    showIcon();
  },[])

  const controlAccess = () => {
    if (!currentUser) {
      // Grant no access for not-logged-in-user even via URL 
      history.push("/");
    } else {
      // Profile
      return (
        <div>
          <div className="upper-profile">
            <div className="profile-icon">
              <img src={iconURL}  width="100px" />
              <span hidden={!loading}>...Loading...</span>
              <input onChange={uploadIcon} type='file' name="icon"/>
            </div>
            <div>
              <h2>{nickname}</h2>
              <h3>Belong to what group</h3>
              <h3>discussion number</h3>
            </div>
          </div>

          <div className="lower-profile">
            <h3>Your discussions</h3>
            <h5>Expand all</h5>
          </div>
        </div>
      );
    };
  };

  return (
    <section className="profile-page">
      {controlAccess()}
    </section>
  );
};

export default Profile
