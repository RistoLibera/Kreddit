import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import { css } from '@emotion/react';
import ClockLoader from 'react-spinners/ClockLoader';
// import i18n (needs to be bundled ;)) 
import './i18n';

const spinnerCSS = css`
display: block;
position: absolute;
top: 50%;
right: 50%;
transform: translate(50%, -50%);
margin: 0 auto;
border-color: red;
`;

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={
      <div className='page-loader'>
        <ClockLoader color='#8E5829' css={spinnerCSS} size={100} />
      </div>
    }>
      <Routes />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
