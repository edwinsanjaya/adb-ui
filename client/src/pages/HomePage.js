import React, { Component, useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import axios from "axios"
import { Link } from 'react-router-dom'
import {
  LocalizationProvider,
  DesktopDatePicker,
} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './HomePage.scss'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function HomePage(props) {
  const [dashboard3, setDashboard3] = useState([])
  const [dashboard4, setDashboard4] = useState([])

  const [topCancelReasons, setTopCancelReasons] = useState([])
  const [topReturnReasons, setTopReturnReasons] = useState([])

  const getDashboard3 = async () => {
    const url = 'http://localhost:5000/dashboard/top-ten-county-by-supplier'
    const response = await axios.get(url);
    setDashboard3(response.data)
  }

  const getDashboard4 = async () => {
    const url = 'http://localhost:5000/dashboard/top-ten-town-by-supplier'
    const response = await axios.get(url);
    setDashboard4(response.data)
  }

  const getTopCancelReasons = async () => {
    const url = 'http://localhost:5000/dashboard/top-five-cancel-order-reason'
    const response = await axios.get(url);
    setTopCancelReasons(response.data)
  }

  const getTopReturnReasons = async () => {
    const url = 'http://localhost:5000/dashboard/top-five-return-order-reason'
    const response = await axios.get(url);
    setTopReturnReasons(response.data)
  }

  // const getProductsMostOrders = async () => {
  //   const url = 'http://localhost:5000/dashboard/top-ten-products-highest-orders'
  //   const response = await axios.get(url);
  //   setProductsMostOrders(response.data)
  // }

  const getProductsMostReturns = async () => {
    const url = 'http://localhost:5000/dashboard/top-ten-products-highest-returns'
    const response = await axios.get(url);
    setProductsMostReturns(response.data)
  }

  // Suppliers - Filter
  const [suppliersByProducts, setSuppliersByProducts] = useState([])
  const [suppliersByOrders, setSuppliersByOrders] = useState([])
  
  var suppliers_search = {
    creationStartTime: 0,
    creationEndTime: 0,
    orderStartTime: 0,
    orderEndTime: 0,
  }

  const [suppliersCreationStartTime, setSuppliersCreationStartTime] = useState(dayjs('2012-01-01T00:00:00'))
  const [suppliersCreationEndTime, setSuppliersCreationEndTime] = useState(dayjs('2012-09-01T00:00:00'))
  const [suppliersOrderStartTime, setSuppliersOrderStartTime] = useState(dayjs('2011-01-01T00:00:00'))
  const [suppliersOrderEndTime, setSuppliersOrderEndTime] = useState(dayjs('2011-06-30T00:00:00'))


  async function filterSuppliersByProducts() {
    document.getElementById('suppliers-by-products-filter-status').innerHTML = "Loading...";
    document.getElementById('suppliers-by-products-section').classList.add("loading");

    const url = 'http://localhost:5000/dashboard/filter/top-ten-suppliers-by-products'

    suppliers_search.creationStartTime = suppliersCreationStartTime.valueOf()
    suppliers_search.creationEndTime = suppliersCreationEndTime.valueOf()

    const data = {
      startPeriod: suppliers_search.creationStartTime,
      endPeriod: suppliers_search.creationEndTime,
    }

    const response = await axios.post(url, data);
    setSuppliersByProducts(response.data);

    document.getElementById('suppliers-by-products-filter-status').innerHTML = "Done!";
    document.getElementById('suppliers-by-products-section').classList.remove("loading");
    document.getElementById('suppliers-by-products-filter-status').innerHTML = "";
  }

  async function filterSuppliersByOrders() {
    document.getElementById('suppliers-by-orders-filter-status').innerHTML = "Loading...";
    document.getElementById('suppliers-by-orders-section').classList.add("loading");

    const url = 'http://localhost:5000/dashboard/filter/top-ten-suppliers-by-orders'

    suppliers_search.orderStartTime = suppliersOrderStartTime.valueOf()
    suppliers_search.orderEndTime = suppliersOrderEndTime.valueOf()

    const data = {
      startPeriod: suppliers_search.orderStartTime,
      endPeriod: suppliers_search.orderEndTime,
    }

    const response = await axios.post(url, data);
    setSuppliersByOrders(response.data);

    document.getElementById('suppliers-by-orders-filter-status').innerHTML = "Done!";
    document.getElementById('suppliers-by-orders-section').classList.remove("loading");
    document.getElementById('suppliers-by-orders-filter-status').innerHTML = "";
  }


  // Products - Filter
  const [productsMostOrders, setProductsMostOrders] = useState([])
  const [productsMostReturns, setProductsMostReturns] = useState([])
  
  var products_search = {
    orderStartTime: 0,
    orderEndTime: 0,
    returnStartTime: 0,
    returnEndTime: 0
  }

  const [productsOrderStartTime, setProductsOrderStartTime] = useState(dayjs('2011-01-01T00:01:00'))
  const [productsOrderEndTime, setProductsOrderEndTime] = useState(dayjs('2011-06-30T00:00:00'))
  const [productsReturnStartTime, setProductsReturnStartTime] = useState(dayjs('2011-10-01T00:00:00'))
  const [productsReturnEndTime, setProductsReturnEndTime] = useState(dayjs('2012-07-31T00:00:00'))

  async function filterProductsHighestOrders() {
    document.getElementById('products-highest-orders-filter-status').innerHTML = "Loading...";
    document.getElementById('products-highest-orders-section').classList.add("loading");

    const url = 'http://localhost:5000/dashboard/filter/top-ten-products-with-highest-orders'

    products_search.orderStartTime = productsOrderStartTime.valueOf()
    products_search.orderEndTime = productsOrderEndTime.valueOf()

    const data = {
      startPeriod: products_search.orderStartTime,
      endPeriod: products_search.orderEndTime,
    }

    const response = await axios.post(url, data);
    setProductsMostOrders(response.data);

    document.getElementById('products-highest-orders-filter-status').innerHTML = "Done!";
    document.getElementById('products-highest-orders-section').classList.remove("loading");
    document.getElementById('products-highest-orders-filter-status').innerHTML = "";
  }

  // async function filterProductsHighestReturns() {
  //   document.getElementById('products-highest-returns-filter-status').innerHTML = "Loading...";
  //   document.getElementById('products-highest-returns-section').classList.add("loading");

  //   const url = 'http://localhost:5000/dashboard/filter/top-ten-products-with-highest-returns'

  //   products_search.returnStartTime = productsReturnStartTime.valueOf()
  //   products_search.returnEndTime = productsReturnEndTime.valueOf()

  //   const data = {
  //     startPeriod: products_search.returnStartTime,
  //     endPeriod: products_search.returnEndTime,
  //   }

  //   const response = await axios.post(url, data);
  //   setProductsMostReturns(response.data);

  //   document.getElementById('products-highest-returns-filter-status').innerHTML = "Done!";
  //   document.getElementById('products-highest-returns-section').classList.remove("loading");
  //   document.getElementById('products-highest-returns-filter-status').innerHTML = "";
  // }



  useEffect(() => {
    filterSuppliersByProducts()
    filterSuppliersByOrders()
    filterProductsHighestOrders()
    // filterProductsHighestReturns()
    getProductsMostReturns()
    getDashboard3()
    getDashboard4()
    getTopCancelReasons()
    getTopReturnReasons()
  }, [])

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <div id="suppliers-section">
          <div className='header'>
            <Grid container>
              <Grid item xs={12}>
                <Item><h2>Suppliers Highlight</h2></Item>
              </Grid>
            </Grid>
          </div>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={6}>
            <Item>
              <div id="suppliers-by-products-section">
                <h4>Top 10 Suppliers by Products</h4>
                <div className="d-flex align-items-center justify-content-center">
                  <div>Creation period:</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        name="startTime"
                        label="Start Date"
                        inputFormat="MM/DD/YYYY"
                        minDate="01/01/2012"
                        maxDate="09/01/2012"
                        value={suppliersCreationStartTime}
                        onChange={(value) => {
                          setSuppliersCreationStartTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <DesktopDatePicker
                        name="endTime"
                        label="End Date"
                        inputFormat="MM/DD/YYYY"
                        minDate="01/01/2012"
                        maxDate="09/01/2012"
                        value={suppliersCreationEndTime}
                        onChange={(value) => {
                          setSuppliersCreationEndTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <Button className="search-button" variant="contained" onClick={filterSuppliersByProducts}>Search</Button>
                    </div>
                    <div id="suppliers-by-products-filter-status" style={{color: '#00a600', fontSize: '16px', fontWeight: 'bold', margin: '8px'}}></div>
                {suppliersByProducts.length !== 0 &&
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {Object.keys(suppliersByProducts[0]).map(function (key) {
                            return (
                              <StyledTableCell align="left">{key}</StyledTableCell>
                            )
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {suppliersByProducts.map((result, index) => (
                          <StyledTableRow key={index}>
                            {Object.keys(result).map(function (key) {
                              if (key === 'supplier_name')
                                return (
                                  <Link to={"/supplier/" + result.supplier_id + "/detail"}>
                                    <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                  </Link>
                                )
                              else {
                                return (
                                  <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                )
                              }
                            })}
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
                </div>
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              <div id="suppliers-by-orders-section">
                <h4>Top 10 Suppliers by Orders</h4>
                <div className="d-flex align-items-center justify-content-center">
                  <div>Order period:</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        name="startTime"
                        label="Start Date"
                        inputFormat="MM/DD/YYYY"
                        minDate="01/01/2011"
                        maxDate="06/30/2011"
                        value={suppliersOrderStartTime}
                        onChange={(value) => {
                          setSuppliersOrderStartTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <DesktopDatePicker
                        name="endTime"
                        label="End Date"
                        inputFormat="MM/DD/YYYY"
                        minDate="01/01/2011"
                        maxDate="06/30/2011"
                        value={suppliersOrderEndTime}
                        onChange={(value) => {
                          setSuppliersOrderEndTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <Button className="search-button" variant="contained" onClick={filterSuppliersByOrders}>Search</Button>
                    </div>
                    <div id="suppliers-by-orders-filter-status" style={{color: '#00a600', fontSize: '16px', fontWeight: 'bold', margin: '8px'}}></div>
                {suppliersByOrders.length !== 0 &&
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {Object.keys(suppliersByOrders[0]).map(function (key) {
                            return (
                              <StyledTableCell align="left">{key}</StyledTableCell>
                            )
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {suppliersByOrders.map((result, index) => (
                          <StyledTableRow key={index}>
                            {Object.keys(result).map(function (key) {
                              if (key === 'supplier_name')
                                return (
                                  <Link to={"/supplier/" + result.supplier_id + "/detail"}>
                                    <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                  </Link>
                                )
                              else {
                                return (
                                  <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                )
                              }
                            })}
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                }
              </div>
            </Item>
          </Grid>
        </Grid>
        </div>

        <div id="products-section">
          <div className='header'>
            <Grid container>
              <Grid item xs={12}>
                <Item><h2>Products Highlight</h2></Item>
              </Grid>
            </Grid>
          </div>

          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
            <Grid item xs={6}>
              <Item>
                <div id="products-highest-orders-section">
                  <h4>Top 10 Products with the highest orders</h4>
                  <div className="d-flex align-items-center justify-content-center">
                    <div>Order period:</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        name="startTime"
                        label="Start Date"
                        inputFormat="MM/DD/YYYY"
                        minDate="01/01/2011"
                        maxDate="06/30/2011"
                        value={productsOrderStartTime}
                        onChange={(value) => {
                          setProductsOrderStartTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                      <DesktopDatePicker
                        name="endTime"
                        label="End Date"
                        inputFormat="MM/DD/YYYY"
                        minDate="01/01/2011"
                        maxDate="06/30/2011"
                        value={productsOrderEndTime}
                        onChange={(value) => {
                          setProductsOrderEndTime(value);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <Button className="search-button" variant="contained" onClick={filterProductsHighestOrders}>Search</Button>
                  </div>
                  <div id="products-highest-orders-filter-status" style={{color: '#00a600', fontSize: '16px', fontWeight: 'bold', margin: '8px'}}></div>

                  {productsMostOrders.length !== 0 &&
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                          <TableRow>
                          {Object.keys(productsMostOrders[0]).map(function (key) {
                              return (
                                <StyledTableCell align="left">{key}</StyledTableCell>
                              )
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productsMostOrders.map((result, index) => (
                            <StyledTableRow key={index}>
                              {Object.keys(result).map(function (key) {
                                if (key === 'product_name')
                                return (
                                  <Link to={"/product/" + result.product_id + "/detail"}>
                                    <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                  </Link>
                                )
                                else {
                                  return (
                                    <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                  )
                                }
                              })}
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  }
                </div>
              </Item>
            </Grid>

            <Grid item xs={6}>
              <Item>
                <div id="products-highest-returns-section">
                  <h4>Top 10 Products with the highest returns</h4>
                  <div className="d-flex align-items-center justify-content-center" style={{paddingTop: '64px'}}>
                      {/* <div>Return period:</div>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                          name="startTime"
                          label="Start Date"
                          inputFormat="MM/DD/YYYY"
                          minDate="10/01/2011"
                          maxDate="07/31/2012"
                          value={productsReturnStartTime}
                          onChange={(value) => {
                            setProductsReturnStartTime(value);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                        <DesktopDatePicker
                          name="endTime"
                          label="End Date"
                          inputFormat="MM/DD/YYYY"
                          minDate="10/01/2011"
                          maxDate="07/31/2012"
                          value={productsReturnEndTime}
                          onChange={(value) => {
                            setProductsReturnEndTime(value);
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <Button className="search-button" variant="contained" onClick={filterProductsHighestReturns}>Search</Button> */}
                    </div>
                    {/* <div id="products-highest-returns-filter-status" style={{color: '#00a600', fontSize: '16px', fontWeight: 'bold', margin: '8px'}}></div> */}

                  {productsMostReturns.length !== 0 &&
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            {Object.keys(productsMostReturns[0]).map(function (key) {
                              return (
                                <StyledTableCell align="left">{key}</StyledTableCell>
                              )
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productsMostReturns.map((result, index) => (
                            <StyledTableRow key={index}>
                              {Object.keys(result).map(function (key) {
                                if (key === 'product_name')
                                return (
                                  <Link to={"/product/" + result.product_id + "/detail"}>
                                    <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                  </Link>
                                )
                                else {
                                  return (
                                    <StyledTableCell align="left">{result[key]}</StyledTableCell>
                                  )
                                }
                              })}
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  }
                </div>
              </Item>
            </Grid>
          </Grid>
        </div>


        <div className='header'>
          <Grid container>
            <Grid item xs={12}>
              <Item><h2>Regional Highlight</h2></Item>
            </Grid>
          </Grid>
        </div>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>

          <Grid item xs={6}>
            <Item>
              <h4>Top 10 Counties by Suppliers</h4>
              {dashboard3.length !== 0 &&
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {Object.keys(dashboard3[0]).map(function (key) {
                          return (
                            <StyledTableCell align="left">{key}</StyledTableCell>
                          )
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard3.map((result, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(result).map(function (key) {
                            return (
                              <StyledTableCell align="left">{result[key]}</StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              <h4>Top 10 Towns by Suppliers</h4>
              {dashboard4.length !== 0 &&
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {Object.keys(dashboard4[0]).map(function (key) {
                          return (
                            <StyledTableCell align="left">{key}</StyledTableCell>
                          )
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard4.map((result, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(result).map(function (key) {
                            return (
                              <StyledTableCell align="left">{result[key]}</StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Item>
          </Grid>
        </Grid>


        <div className='header'>
          <Grid container>
            <Grid item xs={12}>
              <Item><h2>Bad Order Highlight</h2></Item>
            </Grid>
          </Grid>
        </div>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>

          <Grid item xs={6}>
            <Item>
              <h4>Top 5 Cancellation Reasons</h4>
              {topCancelReasons.length !== 0 &&
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {Object.keys(topCancelReasons[0]).map(function (key) {
                          return (
                            <StyledTableCell align="left">{key}</StyledTableCell>
                          )
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topCancelReasons.map((result, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(result).map(function (key) {
                            return (
                              <StyledTableCell align="left">{result[key]}</StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Item>
          </Grid>

          <Grid item xs={6}>
            <Item>
              <h4>Top 5 Return Reasons</h4>
              {topReturnReasons.length !== 0 &&
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {Object.keys(topReturnReasons[0]).map(function (key) {
                          return (
                            <StyledTableCell align="left">{key}</StyledTableCell>
                          )
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topReturnReasons.map((result, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(result).map(function (key) {
                            return (
                              <StyledTableCell align="left">{result[key]}</StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>

  )

}

export default HomePage;