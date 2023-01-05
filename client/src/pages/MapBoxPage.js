// import React, {useState, useEffect} from 'react';

// // function MapBoxPage(props) {

// //   token='pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q'


// //   const [state, setState] = useState({
// //     long: 24.7961,
// //     lat: 120.9967,
// //     zoom: 10,
// //   })

// //   return (
// //     <div>

// //     </div>
// //   );
// // }

// // export default MapBoxPage;
// import mapboxgl from 'mapbox-gl';
// import './MapBoxPage.scss';

// mapboxgl.accessToken='pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q';

// // Sample data 
// const data = [
// 	{
// 		"location": "Manhattan Ave & Norman Ave at NE corner",
// 		"city": "Brooklyn",
// 		"state": "New York",
// 		"coordinates": [-73.9516030004786,40.72557300071668],
// 	},
// 	{
// 		"location": "6th Ave & 42nd St at NW corner",
// 		"city": "Manhattan",
// 		"state": "New York",
// 		"coordinates": [-73.98393399979334,40.75533300052329],
// 	},
// 	{
// 		"location": "Essex St & Delancey St at SE corner",
// 		"city": "Manhattan",
// 		"state": "New York",
// 		"coordinates": [-73.9882730001973,40.718207001246554],
// 	}
// ]

// class MapBoxPage extends React.Component{

// 	// Set up states for updating map 
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			lng: 120.9967,
// 			lat: 24.7961,
// 			zoom: 14
// 		}
// 	}

// 	// Create map and lay over markers
// 	componentDidMount(){
// 		const map = new mapboxgl.Map({
// 			container: this.mapContainer,
// 			style: 'mapbox://styles/edwinsanjaya/clcjf0p3x00n114oxbaidcqot', 
// 			center: [this.state.lng, this.state.lat],
// 			zoom: this.state.zoom
// 		})

// 		data.forEach((location) => {
// 			console.log(location)
// 			var marker = new mapboxgl.Marker()
// 							.setLngLat(location.coordinates)
// 							.setPopup(new mapboxgl.Popup()
// 							.setHTML('<h4>' + location.city + '</h4>' + location.location))
// 							.addTo(map);

// 		})
// 	}

// 	render(){
// 		return(
// 			<div>
// 				<div ref={el => this.mapContainer = el}/>
// 			</div>
// 		)
// 	}
// }

// export default MapBoxPage;

import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapBoxPage.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken='pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q';

function MapBoxPage(props) {

  const token = 'pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q'

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [state, setState] = useState({
    long: 120.9967,
    lat: 24.7961,
    zoom: 10,
  })

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/edwinsanjaya/clcjf0p3x00n114oxbaidcqot',
      center: [state.long, state.lat],
      zoom: state.zoom
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapBoxPage;

