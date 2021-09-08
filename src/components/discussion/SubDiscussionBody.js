import React, { useState, useEffect } from 'react';
import FirebasePack from '../../config/FirebasePack';
import firebase from 'firebase/app';

const SubDiscussionBody = (props) => {
  const { currentUser, documents, rootUpdate } = props;
  const [divGroups, setDivGroups] = useState([]);

  // Get all subdiscussions recursively
  const getAllLayers = (upperInfo, allInfos, container = [upperInfo]) => {
    let response = upperInfo.replied_by;
    if (response) {
      let lowerInfos = allInfos.filter((info) => response.some((uid) => uid === info.discussion_uid));
      for (let info of lowerInfos) {
        container.push(info);
        getAllLayers(info, allInfos ,container);
      }
    }
    return container;
  };

  // Map divs
  const mapDivs = (docInfos) => {
    let container = [];
    let topLayerInfo = docInfos.filter((info) => info.layer === 1);
    let otherLayerInfo = docInfos.filter((info) => info.layer > 1);

    topLayerInfo.forEach((info) => {
      let structure = getAllLayers(info, otherLayerInfo);
      container.push(structure);
    });
    container = container.flat(1);
    setDivGroups(container);
  };

  // Get subdiscussions info
  const getInfo = (documents) => {
    let container = [];
    documents.forEach((doc) => {
      let info = {
        discussion_uid: doc.data().discussion_uid,
        content: doc.data().content,
        creator: doc.data().creator_name,
        layer: doc.data().layer,
        replied_by: doc.data().replied_by
      };
      container.push(info);
    });
    return container;
  };

  const showContent = () => {
    let docInfos = getInfo(documents);
    mapDivs(docInfos);
  };
  
  useEffect(() => {
    showContent();
  }, [documents]);

  return (
    <div className='subdiscussion-container'>
      <h1>SubDiscussionBody</h1>
    </div>
  );
};

export default SubDiscussionBody;