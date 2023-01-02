import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Table } from 'reactstrap'

function ProductDetailPage(props) {

  const params = useParams()

  const [product, setProduct] = useState([]);

  const getProduct = async () => {
    try {
      const response = await (await fetch('http://localhost:5000/product/' + params.product_id));
      const jsonResponse = await response.json();
      setProduct(jsonResponse[0])
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    getProduct();
  }, [])

  return (
    <div>
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
    </div>
  );
}

export default ProductDetailPage;