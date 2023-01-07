import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapBoxPage.scss';
import 'mapbox-gl/dist/mapbox-gl.css';

import dayjs from 'dayjs';

import {
  Stack,
  TextField,
  Button
} from '@mui/material/';

import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q';

var search = {
  country: "",
  town: "",
  startTime: 0,
  endTime: 0
}

function SupplierMapPage(props) {

  const [suppliers, setSuppliers] = useState([])
  const [startTime, setStartTime] = useState(dayjs('2010-01-01T00:00:01'))
  const [endTime, setEndTime] = useState(dayjs('2011-01-01T00:00:01'))

  const dummy = [
    {
      "location": "Hsinchu Park",
      "city": "East District",
      "state": "Hsinchu City",
      "coordinates": [120.9773, 24.8009],
    }
  ]

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [state, setState] = useState({
    long: 120.9605,
    lat: 23.6978,
    zoom: 7,
    rng: 1
  })

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/edwinsanjaya/clcjf0p3x00n114oxbaidcqot',
      center: [state.long, state.lat],
      zoom: state.zoom
    })

    suppliers.forEach((supplier) => {

      var popup = new mapboxgl.Popup({ offset: 30 })
        .setHTML('<h4>' + supplier.supplier_name + '</h4>' + supplier.supplier_address + " " + supplier.supplier_zipcode)

      var marker = new mapboxgl.Marker()
        .setLngLat([supplier.longitude, supplier.latitute])
        .setPopup(popup)

        .addTo(map.current)
    });
  }, [suppliers]);

  return (
    <div>
      <div>{JSON.stringify(startTime)} {JSON.stringify(endTime)}</div>
      <div className="search-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DesktopDatePicker
              name="startTime"
              label="Start Date"
              inputFormat="MM/DD/YYYY"
              value={startTime}
              onChange={(value) => {
                setStartTime(value);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
            <DesktopDatePicker
              name="endTime"
              label="End Date"
              inputFormat="MM/DD/YYYY"
              value={endTime}
              onChange={(value) => {
                setEndTime(value);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Stack>
        </LocalizationProvider>
        <Button variant="contained">Search</Button>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default SupplierMapPage;