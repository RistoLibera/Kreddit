import React, { useEffect, useState } from 'react';
import FirebasePack from '../../config/FirebasePack';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const changeCurrentUser = () => {
    FirebasePack.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });   
  };

  useEffect(() => {
    changeCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser
      }}
    >
      { children }
    </AuthContext.Provider>
  );
};
