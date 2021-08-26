import React, { useEffect, useState } from 'react';
import Firebase from '../../config/Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  // Watch for current user
  const changeCurrentUser = () => {
    Firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user)
      setPending(false)
    });
  };
  
  // Ony need add observer once
  useEffect(() => {
    changeCurrentUser()
  }, []);

  // Wait for server
  if(pending) {
    return (
      <section className="loading">
      </section>
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
