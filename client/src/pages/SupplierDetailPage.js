import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Table } from 'reactstrap'
import axios from 'axios'
import {
  Box,
  Tab
} from '@mui/material'
import {
  TabContext,
  TabList,
  TabPanel
} from '@mui/lab'

import Mapbox from '../components/Mapbox'
import mapboxgl, { LngLat } from 'mapbox-gl';

function SupplierDetailPage(props) {

  const params = useParams()

  const [supplier, setSupplier] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [value, setValue] = useState("supplier");
  

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

  function supplierToDataset(){
    let supplierHeading = '<h4>' + supplier.supplier_name + '</h4>'
    let supplierDetail = supplier.supplier_address + '<br>' + 'Zip Code:' + supplier.supplier_zipcode + '<br>'
    console.log(supplier)
    console.log(supplier.supplier_longitude)
    let temp = {
      'coordinates': new mapboxgl.LngLat(parseFloat(supplier.supplier_longitude), parseFloat(supplier.supplier_latitude)),
      'popupHTML': supplierHeading + supplierDetail
    }  
    return [temp]
  }

  const dataset = supplier.length == 0 ? [{}] : supplierToDataset()

  useEffect(() => {
    getProducts();
    getSupplier();
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

  function supplierMap() {
    return(
      <div>
        <Mapbox
          dataset={dataset}
        />
      </div>
    )
  }

  return (
    <div>
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