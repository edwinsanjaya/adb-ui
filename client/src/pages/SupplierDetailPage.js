import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Table } from 'reactstrap'
import axios from 'axios'

function SupplierDetailPage(props) {

  const params = useParams()

  const [supplier, setSupplier] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

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

  useEffect(() => {
    getProducts();
    getSupplier()
  }, [])

  return (
    <div>
      {/* {JSON.stringify(supplier)} */}
      <div><h3>{supplier.supplier_name}</h3></div>
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
      <div><h3>Products from Supplier</h3></div>
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
  );
}

export default SupplierDetailPage;