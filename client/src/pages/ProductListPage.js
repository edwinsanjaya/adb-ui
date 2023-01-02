import React, { useEffect, useState} from 'react';
import { Table } from 'reactstrap'
import { Link } from 'react-router-dom'

function ProductListPage(props) {
  
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await (await fetch('http://localhost:5000/products'));
      const jsonResponse = await response.json();
      setProducts(jsonResponse)
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getProducts();
  }, [])
  
  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th scope="col">Product ID</th>
            <th scope="col">Product Name</th>
            <th scope="col">Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <tr key={product.product_id}>
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

export default ProductListPage;