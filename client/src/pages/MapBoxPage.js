import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapBoxPage.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken='pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q';

function MapBoxPage(props) {

  const token = 'pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q'

  const dummy = [
    {
      "location": "Hsinchu Park",
      "city": "East District",
      "state": "Hsinchu City",
      "coordinates": [120.9773,24.8009],
    },
    {
      "location": "Far Eastern Zhubei Store",
      "city": "East District",
      "state": "Hsinchu City",
      "coordinates": [121.0233,24.8224],
    },
    {
      "location": "Essex St & Delancey St at SE corner",
      "city": "Manhattan",
      "state": "New York",
      "coordinates": [120.9709,24.7749],
    }
  ]

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [state, setState] = useState({
    long: 120.9605,
    lat: 23.6978,
    zoom: 7,
  })

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/edwinsanjaya/clcjf0p3x00n114oxbaidcqot',
      center: [state.long, state.lat],
      zoom: state.zoom
    })
    
    dummy.forEach((location) => {
      
      var popup = new mapboxgl.Popup({offset: 30})
      .setHTML('<h4>' + location.city + '</h4>' + location.location)
      
      var marker = new mapboxgl.Marker()
      .setLngLat(location.coordinates)
      .setPopup(popup)
      
      .addTo(map.current)
    });
  });

  return (
    <div>
      <div>
        
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapBoxPage;