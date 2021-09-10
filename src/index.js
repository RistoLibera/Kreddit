import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';

// import i18n (needs to be bundled ;)) 
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
