import React from 'react';
import GroupButtons from '../components/discussion/GroupButtons';

const Discussions = () => {
  // Can choose by group on round buttons.


  return (
    <section className='discussions-page'>
      <GroupButtons />
      <div className='discussions-list'>
        <ul>
          <li>
            <div className='left-area'>
              <h1>Icon</h1>
              <h2>Host</h2>
            </div>

            <div className='middle-area'>
              <div className='upper-bar'>
                <h2>Which group</h2>
                <h1>Title</h1>
              </div>

              <div className='lower-bar'>
                <p>Discussion amount</p>
                <p>Rating</p>
                <p>Published time</p>
              </div>
            </div>

            <div className='right-area'>
              <button>Entry</button>
            </div>
          </li>
        </ul>
      </div>

    </section>
  );
};

export default Discussions;
