import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../components/loading/Auth';
import Firebase from '../config/Firebase';
import Default from '../assets/img/default-icon.jpg';
// Components
import handleFirebaseError from '../components/error/FirebaseError';
import ShowIcon from '../components/user/ShowIcon';
import DeleteAccount from '../components/user/DeleteAccount';
import ChangePassword from '../components/user/ChangePassword';
import ShowInfo from '../components/user/ShowInfo';
import '../styles/css/profile.css';

const Profile = () => {
  const { uid }  = useParams();
  const { loading, setLoading } = useContext(AuthContext);
  let reactiveClass;
  let containerClass;
  let info;
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("");
  const [nation, setNation] = useState("");
  const [iconURL, setIconURL] = useState('');
  const [iconError, setIconError] = useState([]);

  // Fetch data from Firestore and Firestorage
  const fetchData = async () => {
    let imgURL = Default;
    // Start loading
    setLoading(true);

    try {
      imgURL = 
        await Firebase
          .storage()
          .ref('user-icon/' + uid + '/icon.jpg')
          .getDownloadURL();
    } catch (error) {
      setIconError(handleFirebaseError(error));
    }

    setIconURL(imgURL);

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
    // Stop loading
    setLoading(false);
  };

  // Loading screen
  if (loading) {
    containerClass = "hidden";
    reactiveClass = '';
  } else {
    containerClass = "profile-container";
    reactiveClass = 'hidden';
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Data structure
  // groups - Anime -         content             - discussions - 0  1  2 - discussion - 0    1   2   3     - subdis - 0   1   2   3  
  //                -  creator icon introduction  -            -  title  -             - content uid rating -        - content uid rating
  
  // user-info                                -  notif - 0 
  // created-groups   created-discussion      -        - from: uid  content: what to do?

  return (
    <section className="profile-page">
      <div className={reactiveClass}>
      </div>

      <div className={containerClass}>
        <div className='upper-profile'>
          <ShowIcon uid = {uid} iconURL={iconURL} iconError={iconError} />

          <div className='info'>
            <ShowInfo nickname={nickname} gender={gender} nation={nation} />
            <div className='lower-info'>
              <h3>what groups</h3>
              <h3>discussion number</h3>
            </div>
          </div>

          <div className='registration'>
            <DeleteAccount uid = {uid} />
            <ChangePassword uid = {uid} />
          </div>
        </div>

        <div className='lower-profile'>
          <h3>Your discussions</h3>
          <h5>Expand all</h5>
        </div>
      </div>
    </section>
  );
};

export default Profile;
