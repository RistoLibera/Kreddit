import React, { useEffect, useState } from 'react';
import Firebase from '../../config/Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  // Set current user
  const changeCurrentUser = () => {
    Firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  };
  
  // Check state once for each login
  useEffect(() => {
    changeCurrentUser()
  }, []);

  // Wait for server
  if(pending) {
    return (
      <div>
        <h3>Loading....</h3>
      </div>
    );
  };

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
