import React, { useEffect, useState } from 'react';
import { Table, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Pagination, TablePagination } from '@mui/material'

function ProductSearchPage(props) {

  const [state, setState] = React.useState({
    productName: "",
    productId: "",
    rows: 0,
    pages: 0,
    page: 0,
    limit: 50,
    search: ""
  })
  const [products, setProducts] = useState([]);

  async function searchProducts() {
    const result = await axios.get(
      'http://localhost:5000/products/search',
      {
        params: {
          page: state.page,
          limit: state.limit,
          search: state.search
        }
      }
    );
    setProducts(result.data)
    setState({
      ...state,
      rows: result.data.totalRows,
      pages: result.data.totalPage,
      page: result.data.page,
      limit: result.data.limit
    })
  }

  useEffect(() => {
    searchProducts();
  }, [state.page, state.search, state.limit])

  function handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setState({
      ...state,
      [name]: value
    });
  }

  function handleSearch(event) {
    setState({
      ...state,
      search: state.productName,
      page: 0
    });
  }

  function changePage(event, value) {
    setState({
      ...state,
      page: value
    });
  };

  function changeRowsPerPage(event) {
    setState({
      ...state,
      page: 0,
      limit: parseInt(event.target.value, 10)
    });
  }

  return (
    <div>
      {/* <div>Test result: {JSON.stringify(products)}</div> */}
      <Form>
        <FormGroup row>
          <Label for="product_name" sm={2}>Search Product</Label>
          <Col sm={10}>
            <Input type="text" name="productName" id="product_name" value={state.productName} onChange={handleChange} placeholder="Search by product name or ID" />
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
            <th scope="col">Product ID</th>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.result?.map((product) => {
            return (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td><Link to={"/product/" + product.productId + "/detail"}>{product.productName}</Link></td>
                <td>{product.category}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <TablePagination
        component="div"
        count={state.pages}
        page={state.page}
        onPageChange={changePage}
        rowsPerPage={state.limit}
        onRowsPerPageChange={changeRowsPerPage}
      />
      <div>
        Total Records: {state.rows}
      </div>
      <div>
        Page: {state.rows ? state.page + 1 : 0} of {state.pages}
      </div>
      <div>
        
        <div>Test state: {JSON.stringify(state)}</div>
      </div>
    </div>
  );
}

export default ProductSearchPage;