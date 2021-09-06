import React, { useState, useEffect} from 'react';

//  change view matrix or line
const FilterButtons = (props) => {
  const { documents, updateSelection, cancelSelection, allSelection, optionalGroup } = props;
  const [listTags, setListTags] = useState([]);
  const [allActive, setAllActive] = useState('active');

  // Show discussion by group
  const selectGroup = (event, name) => {
    let allButtons = event.target.parentNode.childNodes;
    let element = event.target;
    if (name === '00') {
      if (element.className === 'inactive') {
        allButtons.forEach((li) => {
          li.className = 'inactive';
        });
        setAllActive('active');
        allSelection();
      } else {
        alert('You have select all!');
      }
    } else {
      setAllActive('inactive');
      if (element.className === 'inactive') {
        element.className = 'active';
        updateSelection(name);
      } else {
        element.className = 'inactive';
        cancelSelection(name);
      }
    }
  };

  // Make one list HTML tag
  const makeList = (name, index) => {
    return (
      <li onClick={(event) => selectGroup(event, name)} key={index + 1} className='inactive'>
        {name}
      </li>
    );
  };
  
  const createList = () => {
    console.log(optionalGroup);
    let container = [];
    if(documents.length === 0) return;

    for (const [index, doc] of documents.entries()) {
      let name = doc.data().name;
      let list =  makeList(name, index);
      container.push(list);
    }
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, [documents]);

  return (
    <div className="filter-buttons">
      <ul>
        <li onClick={(event) => selectGroup(event, '00')} key='0' className={allActive}>
          All
        </li>
        {listTags.map((li) => {
          return (
            li
          );
        })}
      </ul>
    </div>
  );
};

export default FilterButtons;