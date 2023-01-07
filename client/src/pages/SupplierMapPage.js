import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { LngLat } from 'mapbox-gl';
import './MapBoxPage.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios'
import dayjs from 'dayjs';

import {
  Stack,
  TextField,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Container
} from '@mui/material/';

import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './SupplierMapPage.scss'

mapboxgl.accessToken = 'pk.eyJ1IjoiZWR3aW5zYW5qYXlhIiwiYSI6ImNsY2pnODFnNzBpanYzdm10eDVhbnVnN2kifQ.IQwREZ9VVrx7vTe8s57i3Q';

var search = {
  county: "",
  town: "",
  startTime: 0,
  endTime: 0
}

var markers = []

function SupplierMapPage(props) {

  // list of supplier
  const [suppliers, setSuppliers] = useState([])

  // inputs
  const [startTime, setStartTime] = useState(dayjs('2010-01-01T00:00:01'))
  const [endTime, setEndTime] = useState(dayjs('2012-01-01T00:00:01'))
  const [inputs, setInputs] = useState({
    county: "",
    town: ""
  })

  // dropdown
  const [counties, setCounties] = useState([])
  const [towns, setTowns] = useState([])

  // API status
  const [status, setStatus] = useState("Try Me!")

  // map
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [lng, setLng] = useState(120.9605);
  const [lat, setLat] = useState(23.6978);
  const [zoom, setZoom] = useState(7);

  const getCounties = async () => {
    const url = 'http://localhost:5000/regions/county'
    const response = await axios.get(url);
    setCounties(response.data)
  }

  const getTowns = async () => {
    const url = 'http://localhost:5000/regions/counties/' + inputs.county + '/towns'
    const response = await axios.get(url);
    setTowns(response.data)
  }

  async function getSuppliers() {
    const url = 'http://localhost:5000/suppliers/filter/region-order-period'
    const data = {
      startPeriod: search.startTime,
      endPeriod: search.endTime,
      town: search.town,
      county: search.county
    }
    const response = await axios.post(url, data);
    setSuppliers(response.data)
    setStatus("Done!")
  }

  useEffect(() => {
    getCounties()
  }, []);

  useEffect(() => {
    getTowns()
  }, [inputs.county])

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
        // center: e.features[0].geometry.coordinates
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

  useEffect(() => {

    removeMarkers()

    suppliers.forEach((supplier) => {

      var supplierHeading = '<h4>' + supplier.supplier_name + '</h4>'
      var supplierTotalOrders = '<h5>Total Orders: ' + supplier.total_orders + '</h5>'
      var supplierDetail = supplier.supplier_address + '<br>' + 'Zip Code:' + supplier.supplier_zipcode
      var supplierUrl = '<a href="http://localhost:3000/supplier/' + supplier.supplier_id + '/detail" target="_blank" rel="noopener noreferrer">View Supplier in New Tab</a><br>'

      var popup = new mapboxgl.Popup({ offset: 30 })
        .setHTML(supplierHeading + supplierTotalOrders + supplierUrl + supplierDetail)

      var marker = new mapboxgl.Marker({ scale: 0.75 })
        .setLngLat(supplier.supplier_geom.coordinates)
        .setPopup(popup)
        .addTo(map.current)

      markers.push(marker)

    });
  }, [suppliers])

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    if (name == 'county') {
      setInputs({
        ...inputs,
        [name]: value,
        town: "",
      });
    }
    else {
      setInputs({
        ...inputs,
        [name]: value
      });
    }

  }

  function handleSearch(event) {
    search.startTime = startTime.valueOf()
    search.endTime = endTime.valueOf()
    search.county = inputs.county
    search.town = inputs.town
    getSuppliers()
    setStatus("Loading...")
  }

  return (
    <div>
      <div>{JSON.stringify(startTime)} {JSON.stringify(endTime)} {JSON.stringify(inputs)}</div>
      {/* <div>{JSON.stringify(counties)}</div> */}
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

        <Container maxWidth="sm">

          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="county">County</InputLabel>
            <Select
              name="county"
              labelId="county"
              id="county"
              value={inputs.county}
              onChange={handleInputChange}
              label="County"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {
                counties.map((county, index) => {
                  return (
                    <MenuItem key={index} value={county.countyeng}>{county.countyeng}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>


          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="town">Town</InputLabel>
            <Select
              name="town"
              labelId="town"
              id="town"
              value={inputs.town}
              onChange={handleInputChange}
              label="Town"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {
                towns.map((town, index) => {
                  return (
                    <MenuItem key={index} value={town.towneng}>{town.towneng}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </Container>

        <Container maxWidth="sm">
          <Button className="search-button" variant="contained" onClick={handleSearch}>Search</Button>
          <div><strong>{status}</strong></div>
        </Container>

        {/* <div>{JSON.stringify(suppliers)}</div> */}
      </div>
      <div className="map-section">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>

    </div>
  );
}

export default SupplierMapPage;