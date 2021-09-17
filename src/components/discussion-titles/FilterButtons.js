import React, { useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

//  change view matrix or line
const FilterButtons = (props) => {
  const { documents, updateSelection, cancelSelection, allSelection, optionalGroup } = props;
  const [listTags, setListTags] = useState([]);
  const [allActive, setAllActive] = useState('active');

  // Corner notification block
  const warningNotif = () => {
    toast((t) => (
      <span onClick={() => toast.dismiss(t.id)} style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', justifyContent: 'center'}}>
        <span>
          <FontAwesomeIcon icon={faExclamationCircle} color='#CCCC00' size='2x' />
        </span>
        <span style={{ paddingLeft: '10px'}}>You have select all!</span>
      </span>
    ));
  };

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
        warningNotif();
      }
    } else {
      let allActiveListHTML = [...allButtons].filter((li) => li.className === 'active');
      if (allActiveListHTML.length === 1 && allActiveListHTML[0] === element) {
        setAllActive('active');
        allSelection();
      } else {
        setAllActive('inactive');
      }

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
    let preChoice = 'inactive';
    if (optionalGroup === name) {
      preChoice = 'active';
      setAllActive('inactive');
    }
    
    return (
      <li onClick={(event) => selectGroup(event, name)} key={index + 1} className={preChoice}>
        {name}
      </li>
    );
  };
  
  const createList = () => {
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