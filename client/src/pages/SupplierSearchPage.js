import React, { useEffect, useState } from 'react';
import { Table, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pagination, TablePagination } from '@mui/material'

var search = {
  supplierName: "",
  supplierAddress: "",
  taiwanCountry: "",
  pages: 0,
}

function SupplierSearchPage(props) {

  const [state, setState] = useState({
    totalItems: 0,
    page: 1,
    size: 50,
    rng: 1,
  })

  const [inputs, setInputs] = useState({
    supplierName: "",
    supplierAddress: "",
    taiwanCountry: ""
  })

  const [suppliers, setSuppliers] = useState([]);

  async function searchSuppliers() {
    const url = 'http://localhost:5000/suppliers/filter'
    const data = {
      taiwanCountry: search.taiwanCountry,
      name: search.supplierName,
      address: search.supplierAddress
    }
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
         page: state.page,
         size: state.size
      }
    }

    const response = await axios.post(url, data, config);
    setSuppliers(response.data.content)
    setState({
      ...state,
      totalItems: response.data.metadata.totalItems,
      page: parseInt(response.data.metadata.page, 10),
      size: parseInt(response.data.metadata.size, 10),
    })
    search.pages = Math.ceil(state.totalItems/state.size)
  }

  useEffect(() => {
    searchSuppliers();
  }, [state.page, state.rng, state.size])

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setInputs({
      ...inputs,
      [name]: value
    });
  }

  function handleSearch(event) {
    search.supplierName = inputs.supplierName
    search.supplierAddress = inputs.supplierAddress
    search.taiwanCountry = inputs.taiwanCountry

    setState({
      ...state,
      page: 1,
      rng: state.rng + 1
    });
  }

  function changePage(event, value) {
    const nextPage = value + 1
    console.log(nextPage)
    setState({
      ...state,
      page: nextPage
    });
  };

  function changeRowsPerPage(event) {
    setState({
      ...state,
      page: 1,
      size: parseInt(event.target.value, 10)
    });
  }

  return (
    <div>
      {/* <div>State: {JSON.stringify(state)}</div>
      <div>Input: {JSON.stringify(inputs)}</div> */}
      <Form>
        <FormGroup row>
          <Label for="supplier_name" sm={2}>Supplier Name</Label>
          <Col sm={10}>
            <Input type="text" name="supplierName" id="supplier_name" value={inputs.supplierName} onChange={handleInputChange} placeholder="Search by Supplier Name" />
          </Col>

          <Label for="supplier_address" sm={2}>Supplier Address</Label>
          <Col sm={10}>
            <Input type="text" name="supplierAddress" id="supplier_address" value={inputs.supplierAddress} onChange={handleInputChange} placeholder="Search by Supplier Address" />
          </Col>

          <Label for="taiwan_country" sm={2}>County</Label>
          <Col sm={10}>
            <Input type="text" name="taiwanCountry" id="taiwan_country" value={inputs.taiwanCountry} onChange={handleInputChange} placeholder="Search by Taiwan Country" />
          </Col>
        </FormGroup>
        {/* <FormGroup row>
          <Label for="product_id" sm={2}>Product ID</Label>
          <Col sm={10}>
            <Input type="text" name="productId" id="product_id" value={state.productId} onChange={handleChange} placeholder="Search by product ID" />
          </Col>
        </FormGroup> */}
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 2 }}>
            <Button onClick={handleSearch} type="button">Search</Button>
          </Col>
        </FormGroup>
      </Form>
      <Table>
        <thead>
          <tr>
            <th scope="col">Supplier ID</th>
            <th scope="col">Supplier Name</th>
            <th scope="col">Address</th>
            <th scope="col">Total Order</th>
            <th scope="col">Total Product</th>
          </tr>
        </thead>
        <tbody>
          {suppliers?.map((supplier) => {
            return (
              <tr key={supplier.supplierId}>
                <td>{supplier.supplierId}</td>
                <td><Link to={"/supplier/" + supplier.supplierId + "/detail"}>{supplier.supplierName}</Link></td>
                <td>{supplier.supplierAddress}</td>
                <td>{supplier.totalOrderCount}</td>
                <td>{supplier.totalProductCount}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <TablePagination
        component="div"
        count={state.totalItems}
        page={state.page-1}
        onPageChange={changePage}
        rowsPerPage={state.size}
        onRowsPerPageChange={changeRowsPerPage}
      />
      <div>
        Total Records: {state.totalItems}
      </div>
      <div>
        Page: {state.page} of {state.pages}
      </div>
      <div>
        <div>Test state: {JSON.stringify(state)}</div>
      </div>
    </div>
  );
}

export default SupplierSearchPage;