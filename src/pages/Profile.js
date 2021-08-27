import React from 'react';
import { useParams } from 'react-router-dom';
import ReactCountryFlag from "react-country-flag";
import Icon from '../components/user/Icon';
import DeleteAccount from '../components/user/DeleteAccount';
import ChangePassword from '../components/user/ChangePassword';
import '../styles/css/profile.css';

const Profile = () => {
  // const [nickname, setNickname] = useState("");
  // Use complex user UID to avoid malice
  const { uid }  = useParams();

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

  // Data structure
  // groups - Anime -   0    - discussions - 0    1     2   3    - subdis - 0   1   2   3  
  //               - title  -             - content uid rating  -        - content uid rating

  // user info -  uid -  nickname gender nation

  return (
    <section className="profile-page">
        <div className="upper-profile">
          <Icon uid = {uid} />

          <div className="info">
            <div className="upper-info">
              <h2>Gender</h2>
              <h2>nickname</h2>
              <ReactCountryFlag countryCode="GB" />
            </div>
            <div className="lower-info">
              <h3>what groups</h3>
              <h3>discussion number</h3>
            </div>
          </div>

          <div className="registration">
            <DeleteAccount uid = {uid} />
            <ChangePassword uid = {uid} />
          </div>
        </div>

        <div className="lower-profile">
          <h3>Your discussions</h3>
          <h5>Expand all</h5>
        </div>
    </section>
  );
};

export default Profile
