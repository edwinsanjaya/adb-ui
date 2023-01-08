import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom'
import {Table} from 'reactstrap'
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

function OrderDetailPage(props) {

    const params = useParams()

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [value, setValue] = useState("order");

    const getSupplier = async (products) => {
        let productIds = products.map(prod => prod.productId).join(',')

        const url = 'http://localhost:5000/suppliers/product_id/' + productIds
        const response = await axios.get(url);

        let mapSupplierId = {}
        for (let data of response.data) {
            mapSupplierId[data.supplier_id] = data
        }

        let temp = []
        for (let i in products) {
            products[i].supplier = mapSupplierId[products[i].supplierId]
            temp.push(products[i])
        }
        setProducts(temp)
    }

    const getProduct = async (productIds) => {
        const data = {
            productIds: productIds
        }
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                page: 1,
                size: 1000
            }
        }
        const url = 'http://localhost:5000/products/filter'
        await axios.post(url, data, config).then(resp => {
            let products = resp.data.content
            setProducts(products)
            if (resp.status == 200 && !!resp.data.content && resp.data.content.length > 0) {
                getSupplier(products)
            }
        });
    }

    const getOrder = async (orderId) => {
        const url = 'http://localhost:5000/orders/' + orderId
        const response = await axios.get(url);
        setOrders(response.data)
    }

    useEffect(() => {
        getOrder(params.order_id)
    }, [])

    useEffect(() => {
        // Empty If no products
        const productIds = orders.map(o => o.product_id)

        if (productIds.length > 0) {
            getProduct(productIds)
        }
    }, [orders])


    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    function orderList() {
        return (
            <div>
                <div>
                    <h3>{params.order_id}</h3>
                </div>
                <Table>
                    <tbody>
                    <tr>
                        <th>customer_id</th>
                        <th>rg_id</th>
                        <th>rm_id</th>
                        <th>rs_id</th>
                        <th>shipping_id</th>
                    </tr>
                    {orders.map((val, idx) => {
                        return (
                            <tr key={val.rg_id + '-' + idx}>
                                <td>{val.customer_id}</td>
                                <td>{val.rg_id}</td>
                                <td>{val.rm_id}</td>
                                <td>{val.rs_id}</td>
                                <td>{val.shipping_id}</td>
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
                <Table>
                    <tbody>
                    <tr>
                        <th scope="row">Product ID</th>
                        <th scope="row">Product Name</th>
                        <th scope="row">Category</th>
                        <th scope="row">Supplier</th>
                        <th scope="row">Supplier Product Count</th>
                    </tr>
                    {products.map((product, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{product.productId}</td>
                                <td><Link
                                    to={"/product/" + product.productId + "/detail"}>{product.productName}</Link></td>
                                <td>{product.category}</td>
                                <td><Link
                                    to={"/supplier/" + product.supplierId + "/detail"}>{product.supplier && product.supplier.supplier_name}</Link>
                                </td>
                                <td>{(product.supplier && product.supplier.total_products) || 0}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }

    return (
        <div>
            <Box sx={{width: '100%', typography: 'body1'}}>
                <TabContext value={value}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                            <Tab label="Order Details" value="order"/>
                            <Tab label="Product List" value="product"/>
                        </TabList>
                    </Box>
                    <TabPanel value="order">{orderList()}</TabPanel>
                    <TabPanel value="product">{productList()}</TabPanel>
                </TabContext>
            </Box>
        </div>
    );
}

export default OrderDetailPage;