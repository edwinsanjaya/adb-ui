import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Table } from 'reactstrap'
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
  Box,
  Tab
} from '@mui/material'
import {
  TabContext,
  TabList,
  TabPanel
} from '@mui/lab'
import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Mapbox from '../components/Mapbox'
import mapboxgl, { LngLat } from 'mapbox-gl';

var search = {
  county: "",
  town: "",
  startTime: 0,
  endTime: 0
}

function SupplierDetailPage(props) {

  const params = useParams()

  const [supplier, setSupplier] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [value, setValue] = useState("supplier");

  const [startTime, setStartTime] = useState(dayjs('2011-01-01T00:00:01'))
  const [endTime, setEndTime] = useState(dayjs('2011-02-01T00:00:01'))

  const [inputs, setInputs] = useState({
    county: "",
    town: ""
  })

  const [status, setStatus] = useState("Try Me!")

  const getSupplier = async () => {
    const url = 'http://localhost:5000/supplier/' + params.supplier_id
    const response = await axios.get(url);
    setSupplier(response.data[0])
  }

  const getProducts = async () => {
    const url = 'http://localhost:5000/products/supplier_id/' + params.supplier_id
    const response = await axios.get(url);
    setProducts(response.data)
  }

  const getOrders = async () => {
    const url = 'http://localhost:5000/orders/filter/supplier_period_region'
    const data = {
      supplierId: params.supplier_id,
      taiwanCounty: !!search.county ? search.county : null,
      taiwanTown: !!search.town ? search.town : null,
      startTime: !!search.startTime ? search.startTime : null,
      endTime: !!search.endTime ? search.endTime : null
    }

    const response = await axios.post(url, data);
    setOrders(response.data)
    setStatus("Done!")
  }

  function supplierToDataset() {
    let supplierHeading = '<h4>' + supplier.supplier_name + '</h4>'
    let supplierDetail = supplier.supplier_address + '<br>' + 'Zip Code:' + supplier.supplier_zipcode + '<br>'
    let temp = {
      'coordinates': new mapboxgl.LngLat(parseFloat(supplier.supplier_longitude), parseFloat(supplier.supplier_latitude)),
      'popupHTML': supplierHeading + supplierDetail,
      'className': 'big-marker'
    }
    return [temp]
  }

  function orderToDataset() {
    let temps = []
    orders.forEach(function (order) {
      let orderHeading = 'Order RG ID:<h4>' + order.rg_id + '</h4><h5>' + order.order_time + '</h5>'
      let orderAddress = 'Order Address:<br>' + order.shipping_address
      console.log(new mapboxgl.LngLat(parseFloat(order.longitude), parseFloat(order.latitude)))
      let temp = {
        'coordinates': new mapboxgl.LngLat(parseFloat(order.longitude), parseFloat(order.latitude)),
        'popupHTML': orderHeading + orderAddress,
        'color': "#FF5733",
      }
      temps.push(temp)
    })
    return temps
  }

  const supplierSet = supplier.length == 0 ? [{}] : supplierToDataset()
  const orderSet = orders.length == 0 ? [{}] : orderToDataset()
  const dataset = supplierSet.concat(orderSet)
  // const dataset = supplierSet

  useEffect(() => {
    getProducts();
    getSupplier();
    getOrders();
  }, [])


  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  function supplierDetail() {
    return (
      <div>
        <div>
          <h3>{supplier.supplier_name}</h3>
        </div>
        <Table>
          <tbody>
            {Object.keys(supplier).map(function (key) {
              return (
                <tr key={key}>
                  <th scope="col">{key}</th>
                  <td>{supplier[key]}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

  function productList() {
    return (
      <div>
        <div><h3>Products from {supplier.supplier_name}</h3></div>
        <Table>
          <tbody>
            <tr>
              <th scope="row">Product ID</th>
              <th scope="row">Product Name</th>
              <th scope="row">Category</th>
            </tr>
            {products.map(function (product, index) {
              return (
                <tr key={index}>
                  <td>{product.product_id}</td>
                  <td><Link to={"/product/" + product.product_id + "/detail"}>{product.product_name}</Link></td>
                  <td>{product.category}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    )
  }

  function handleSearch(event) {
    search.startTime = startTime.valueOf()
    search.endTime = endTime.valueOf()
    search.county = inputs.county
    search.town = inputs.town
    getOrders()
    setStatus("Loading...")
  }

  function supplierMap() {
    return (
      <div>
        <div classMame="search-container">
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
            <Button className="search-button" variant="contained" onClick={handleSearch}>Search</Button>
            <div><strong>{status}</strong></div>
            <div>Total Order: {orders.length}</div>
          </Container>
        </div>


        <Mapbox
          dataset={dataset}
        />
      </div>
    )
  }

  return (
    <div>
      {/* <div>{JSON.stringify(orders)}</div>
      <div>{JSON.stringify(startTime)}</div>
      <div>{JSON.stringify(endTime)}</div> */}
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
              <Tab label="Supplier Details" value="supplier" />
              <Tab label="Product List" value="product" />
              <Tab label="View in Map" value="map" />
            </TabList>
          </Box>
          <TabPanel value="supplier">{supplierDetail()}</TabPanel>
          <TabPanel value="product">{productList()}</TabPanel>
          <TabPanel value="map">{supplierMap()}</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default SupplierDetailPage;