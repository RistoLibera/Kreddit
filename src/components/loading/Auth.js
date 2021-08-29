import React, { useEffect, useState } from 'react';
import Firebase from '../../config/Firebase';

// Set global currentness and loadingness
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const changeCurrentUser = () => {
    Firebase.auth().onAuthStateChanged((user) => {
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
