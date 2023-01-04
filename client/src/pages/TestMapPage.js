import React from 'react';
import './TestMapPage.scss'

function TestMapPage(props) {
  return (
    <div class="embed-container"><iframe width="100%" height="100%" scrolling="no" marginheight="0" marginwidth="0" title="TestMap" src="//learngis2.maps.arcgis.com/apps/Embed/index.html?webmap=716a706f4a4e44e394f8152b48613f1d&extent=-74.0944,40.7282,-73.6439,40.889&zoom=true&previewImage=false&scale=true&disable_scroll=true&theme=light"></iframe></div>
  );
}

export default TestMapPage;