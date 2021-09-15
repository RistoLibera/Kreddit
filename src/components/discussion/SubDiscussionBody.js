import React, { useState, useEffect } from 'react';
import OneSubdiscussion from './OneSubdiscussion';

const SubDiscussionBody = (props) => {
  const { currentUser, documents, rootUpdate } = props;
  const [rearrangedDoc, setRearrangedDoc] = useState([]);

  // Get all subdiscussions recursively
  const getAllLayers = (upperDoc, allDocs, container = [upperDoc]) => {
    let response = upperDoc.data().replied_by;
    if (response) {
      let lowerDocs = allDocs.filter((doc) => response.some((uid) => uid === doc.id));
      for (let doc of lowerDocs) {
        container.push(doc);
        getAllLayers(doc, allDocs ,container);
      }
    }
    return container;
  };

  // Map divs
  const mapDivs = (docArray) => {
    let container = [];
    let topLayerDoc = docArray.filter((doc) => doc.data().layer === 1);
    let otherLayerDoc = docArray.filter((doc) => doc.data().layer > 1);
    topLayerDoc.forEach((doc) => {
      let structure = getAllLayers(doc, otherLayerDoc);
      container.push(structure);
    });
    container = container.flat(1);
    setRearrangedDoc(container);
  };

  // Get subdiscussion documents Array
  const getDocArray = (documents) => {
    let container = [];
    documents.forEach((doc) => {
      container.push(doc);
    });
    return container;
  };

  const showContent = () => {
    let docArray = getDocArray(documents);
    mapDivs(docArray);
  };
  
  useEffect(() => {
    showContent();
  }, [documents]);

  return (
    <div className='subdiscussion-container'>
      <ul>
        {rearrangedDoc.map((doc, index) => {
          return (
            <OneSubdiscussion currentUser={currentUser} document={doc} rootUpdate={rootUpdate} key={index}/>
          );
        })}
      </ul>
    </div>
  );
};

export default SubDiscussionBody;