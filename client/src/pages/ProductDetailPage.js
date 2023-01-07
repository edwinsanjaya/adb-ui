import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'
import { Table } from 'reactstrap'

function ProductDetailPage(props) {

  const params = useParams()

  const [product, setProduct] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const getProduct = async () => {
    try {
      const response = await (await fetch('http://localhost:5000/product/' + params.product_id));
      const jsonResponse = await response.json();
      setProduct(jsonResponse[0])
    } catch (error) {
      console.error(error.message);
    }
  }

  const getSuppliers = async () => {
    try {
      const response = await (await fetch('http://localhost:5000/suppliers/product_id/' + params.product_id))
      const jsonResponse = await response.json();
      setSuppliers(jsonResponse)
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
                <td><Link to={"/supplier/" + product.supplier_id + "/detail"}>{supplier.supplier_name}</Link></td>
                <td>{supplier.total_products}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default ProductDetailPage;