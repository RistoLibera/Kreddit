import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import { SuspenseState } from './components/loading/SuspenseState';
// import i18n (needs to be bundled ;)) 
import './i18n';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<SuspenseState />}>
      <Routes />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
