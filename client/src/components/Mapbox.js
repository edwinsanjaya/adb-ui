import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { LngLat } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Mapbox.scss'

mapboxgl.accessToken = 'pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q';

var markers = []

function Mapbox({dataset=[]}) {

  // map
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(120.9605);
  const [lat, setLat] = useState(23.6978);
  const [zoom, setZoom] = useState(7);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/edwinsanjaya/clcjf0p3x00n114oxbaidcqot',
      center: [lng, lat],
      zoom: zoom
    })
    map.current.on('click', (e) => {
      console.log(e)
      map.current.flyTo({
        center: e.lngLat
      });
    });
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  function removeMarkers() {
    markers.forEach((marker) => marker.remove());
    markers = [];
  }

  //require: data.popupHTML, data.coordinates
  function addMarkers() {
    dataset.forEach((data) => {
      console.log(data)
      var popupHTML = data.popupHTML
      var popup = new mapboxgl.Popup({ offset: 30 })
        .setHTML(popupHTML)
      var marker = new mapboxgl.Marker({ scale: 0.75 })
        .setLngLat(data.coordinates)
        .setPopup(popup)
        .addTo(map.current)
      markers.push(marker)
    });
  }

  useEffect(() => {
    removeMarkers()
    addMarkers()
  }, [dataset])

  return (
    <div>
      <div className="map-section">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default Mapbox;