import React, { useEffect, useState } from 'react';
import FirebasePack from '../../config/FirebasePack';
import { css } from '@emotion/react';
import RiseLoader from 'react-spinners/RiseLoader';

const spinnerCSS = css`
display: block;
margin: 0 auto;
border-color: red;
`;

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
      <section className='loading'>
        <div className='page-loader'>
          <RiseLoader color='#D5D736' css={spinnerCSS} size={150} />
        </div>
      </section>
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
