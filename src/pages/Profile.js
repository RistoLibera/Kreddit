import React from 'react';
import { useParams } from 'react-router-dom';
import ReactCountryFlag from "react-country-flag";
import Icon from '../components/user/Icon';
import DeleteAccount from '../components/user/Delete';
import Password from '../components/user/Password';
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

  return (
    <section className="profile-page">
        <div className="upper-profile">
          <div className="profile-icon">
            <Icon uid = {uid} />
          </div>

          <div>
            <h2>nickname</h2>
            <h2>nation</h2>
            <ReactCountryFlag countryCode="US" />
            <h3>Belong to what groups</h3>
            <h3>discussion number</h3>
          </div>

          <div>
            <DeleteAccount />
            <Password />
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
