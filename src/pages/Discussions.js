import React from 'react';
import FilterButtons from '../components/discussion/FilterButtons';
import CreateDiscussion from '../components/discussion/CreateDiscussion';
import DiscussionList from '../components/discussion/DiscussionList';

const Discussions = () => {
  // Can choose by group on round buttons.


  return (
    <section className='discussions-page'>
      <header>
        <FilterButtons />
        <CreateDiscussion />
      </header>
      
      <DiscussionList />
    </section>
  );
};

export default Discussions;
