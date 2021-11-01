import React from 'react';
import { css } from '@emotion/react';
import DisplayMode from '../user/DisplayMode';
import ClockLoader from 'react-spinners/ClockLoader';
import Koin from '../../assets/img/header-koin.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export const SuspenseState = () => {
  const spinnerCSS = css`
  display: block;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  margin: 0 auto;
  border-color: red;
  `;
  
  return (
    <section>
      <header className='app-header'>
        <div className='left-bar'>
          <form>
            <fieldset>
              <FontAwesomeIcon icon={faSearch} color='' size='2x' />
              <input type='text' id='keyword' name='keyword' placeholder='' maxLength='15'></input>
              <button type='submit' value='Submit'>&emsp;&emsp;&emsp;&emsp;</button>
            </fieldset>
          </form>
        </div>

        <div className='middle-bar'>
          <div onClick={() => history.push('/discussions/00')} className='discussions-bar'>
            <h2></h2>
          </div>
          <div id='icon' onClick={() => history.push('/')} >
            <img src={Koin} alt='Koin'></img>
          </div>
          <div onClick={() => history.push('/groups')} className='groups-bar'>
            <h2></h2>
          </div>
        </div>

        <div className='right-bar'>
          <DisplayMode />
        </div>
      </header>

      <div className='page-loader'>
        <ClockLoader color='#8E5829' css={spinnerCSS} size={100} />
      </div>
    </section>
  );
};

export default SuspenseState;
