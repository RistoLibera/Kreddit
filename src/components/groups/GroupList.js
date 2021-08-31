import React from 'react';

const GroupList = (props) => {
  const { document } = props;

  //  Document data()
  return (
    <div className='group-list'>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
      </ul>
    </div>
  );
};

export default GroupList;