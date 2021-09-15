import React, { useEffect, useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import '../../styles/css/loading.css';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  const changeCurrentUser = () => {
    FirebasePack.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });  
  };

  useEffect(() => {
    changeCurrentUser();
  }, []);

  if(pending){
    return (
      <div className='loading'>
        <h1>...Authenticating...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        pending
      }}
    >
      { children }
    </AuthContext.Provider>
  );
};
