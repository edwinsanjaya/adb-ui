import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Table } from 'reactstrap'

function SupplierDetailPage(props) {

  const params = useParams()

  const [supplier, setSupplier] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const getSupplier = async () => {
    try {
      const response = await (await fetch('http://localhost:5000/supplier/' + params.supplier_id));
      const jsonResponse = await response.json();
      setSupplier(jsonResponse[0])
    } catch (error) {
      console.error(error.message);
    }
  }

  const getProducts = async () => {
    try {
      const response = await (await fetch('http://localhost:5000/products/supplier_id/' + params.supplier_id))
      const jsonResponse = await response.json();
      setProducts(jsonResponse)
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    getProduct();
    getSuppliers()
  }, [])

  return (
    <div>
      <div><h3>{product.product_name}</h3></div>
      <Table>
        <tbody>
          {Object.keys(product).map(function (key) {
            return (
              <tr key={key}>
                <th scope="col">{key}</th>
                <td>{product[key]}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <div><h3>Supplier Owns this Product</h3></div>
      <Table>
        <tbody>
          <tr>
            <th scope="row">Supplier ID</th>
            <th scope="row">Supplier Name</th>
            <th scope="row">Total Products</th>
          </tr>
          {suppliers.map(function (supplier, index) {
            return (
              <tr key={index}>
                <td>{supplier.supplier_id}</td>
                <td>{supplier.supplier_name}</td>
                <td>{supplier.total_products}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default SupplierDetailPage;