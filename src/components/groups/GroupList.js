import React, { useState, useEffect} from 'react';
import Default from '../../assets/img/default-symbol.png';
import FirebasePack from '../../config/FirebasePack';

const GroupList = (props) => {
  const { documents } = props;
  const [listTags, setListTags] = useState([]);

  // Get group symbol
  const getSymbol = async (name) => {
    let symbolURL = Default;
    try {
      symbolURL = 
        await FirebasePack
          .storage()
          .ref('group-symbol/' + name + '/symbol.jpg')
          .getDownloadURL();
    } catch (error) {
      console.log(error.code);
    }
    return symbolURL;
  };
    
  const createList = async () => {
    let name;
    let creator;
    let introduction;
    let list;
    let container = [];
    let symbolURL = await getSymbol(name);

    documents.forEach((doc, index) => {
      name = doc.data().name;
      creator = doc.data().creator;
      introduction = doc.data().introduction;
      list =  <li key={index} className='group-list'>
                <div className='left-block'>
                  <img src={symbolURL} alt='icon' width='40px' />
                  <h2>{name}</h2>
                </div>

                <div className='middle-block'>
                  <p>{creator}</p>
                  <p>{introduction}</p>
                </div>

                <div className='right-block'>
                  <button>To discussion</button>
                </div>
              </li>;
      container.push(list);
    });
    setListTags(container);
  };

  useEffect(() => {
    createList();
  }, []);

  return (
    <div className='all-groups'>
      <ul>
        {listTags.map((li) => {
          return (
            li
          );
        })}
      </ul>
    </div>
  );
};

export default GroupList;