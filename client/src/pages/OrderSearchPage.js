import React, {useEffect, useState} from 'react';
import {Table, Col, Button, Form, FormGroup, Label, Input, FormText} from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Pagination, TablePagination, FormControl, InputLabel, Select, MenuItem} from '@mui/material'

var search = {
    orderId: "",
    productName: "",
    customerId: "",
    supplierId: null,
    orderPeriod: 0,
    shippingZipCode: 0,
    county: "",
    town: "",
    cancelled: null,
    cancelReason: "",
    pages: 0,
}

function OrderSearchPage(props) {
    const [state, setState] = useState({
        totalItems: 0,
        page: 1,
        size: 1,
        rng: "",
    })

    const [inputs, setInputs] = useState({
        orderId: "",
        productName: "",
        customerId: "",
        supplierId: 0,
        orderPeriod: 0,
        shippingZipCode: 0,
        county: "",
        town: "",
        cancelled: null,
        cancelReason: "",
    })
    // const rgIdFilter = body.rgId; orderId
    // const productFilter = body.product; productName
    // const customerIdFilter = body.customerId; customerId
    // const supplierIdFilter = body.supplier; supplierId
    // const periodFilter = body.period; orderPeriod
    // const zipCodeFilter = body.zipCode; shippingZipCode
    // const countyFilter = body.county; county
    // const townFilter = body.town; town
    // const cancelledFilter = body.cancelled;
    // const cancelReasonFilter = body.cancelReason;

    const [orders, setOrders] = useState([]);

    async function searchOrders() {
        const url = 'http://localhost:5000/orders/filter'
        const data = {
            rgId: search.orderId,
            product: search.productName,
            customerId: search.customerId,
            supplier: search.supplierId,
            period: search.orderPeriod,
            zipCode: search.shippingZipCode,
            county: search.county,
            town: search.town,
            cancelled: search.cancelled,
            cancelReason: search.cancelReason
        }

        const data2 = {}
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            params: {
                page: state.page,
                size: state.size
            }
        }

        const response = await axios.post(url, data2, config);
        setOrders(response.data.content)
        setState({
            ...state,
            totalItems: response.data.metadata.totalItems,
            page: parseInt(response.data.metadata.page, 10),
            size: parseInt(response.data.metadata.size, 10),
        })
        search.pages = Math.ceil(state.totalItems / state.size)
    }

    useEffect(() => {
        searchOrders();
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
            <div>State: {JSON.stringify(state)}</div>
            <div>Input: {JSON.stringify(inputs)}</div>

            <Form>
                <FormGroup row>
                    <div style={{display:'flex'}}>
                        <div style={{width:'100%'}}>
                            <Label for="order_id" sm={2}>Order ID</Label>
                            <Col sm={10}>
                                <Input type="text" name="orderId" id="order_id" value={inputs.orderId}
                                       onChange={handleInputChange} placeholder="Search By Order ID"/>
                            </Col>

                            <Label for="product_name" sm={2}>Product Name</Label>
                            <Col sm={10}>
                                <Input type="text" name="productName" id="product_name" value={inputs.productName}
                                       onChange={handleInputChange} placeholder="Search Product Name"/>
                            </Col>

                            <Label for="customer_id" sm={2}>Customer ID</Label>
                            <Col sm={10}>
                                <Input type="text" name="customerId" id="customer_id" value={inputs.customerId}
                                       onChange={handleInputChange} placeholder="Search Customer ID"/>
                            </Col>

                            <Label for="supplier_id" sm={2}>Supplier ID</Label>
                            <Col sm={10}>
                                <Input type="text" name="supplierId" id="supplier_id" value={inputs.supplierId}
                                       onChange={handleInputChange} placeholder="Search By Supplier ID"/>
                            </Col>
                        </div>
                        <div style={{width:'100%'}}>
                            <Label for="order_period" sm={1}>Order Period</Label>
                            <Col sm={10}>
                                <Input type="text" name="orderPeriod" id="order_period" value={inputs.orderPeriod}
                                       onChange={handleInputChange} placeholder="Search Order Period"/>
                            </Col>

                            <Label for="shipping_zip_code" sm={2}>Shipping Zip Code</Label>
                            <Col sm={10}>
                                <Input type="number" name="shippingZipCode" id="shipping_zip_code"
                                       value={inputs.shippingZipCode} onChange={handleInputChange}
                                       placeholder="Shipping Zip Code"/>
                            </Col>

                            <Label for="county" sm={2}>County</Label>
                            <Col sm={10}>
                                <Input type="text" name="county" id="county" value={inputs.county} onChange={handleInputChange}
                                       placeholder="Search By County"/>
                            </Col>

                            <Label for="town" sm={2}>Town</Label>
                            <Col sm={10}>
                                <Input type="text" name="town" id="town" value={inputs.town} onChange={handleInputChange}
                                       placeholder="Search By Town"/>
                            </Col>

                            <Label for="is_cancelled" sm={2}>Is Cancelled</Label>
                            <Col sm={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="is_cancelled">Is Canceled</InputLabel>
                                    <Select
                                        labelId="is_cancelled"
                                        id="is_cancelled-select"
                                        // value={rng}
                                        label="Age"
                                        // onChange={handleChange}
                                    >
                                        <MenuItem value={null}>N/A</MenuItem>
                                        <MenuItem value={true}>Cancelled</MenuItem>
                                        <MenuItem value={false}>Not Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                        </div>
                    </div>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{size: 10, offset: 2}}>
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
                {orders?.map((orderData) => {
                    return (
                        <tr key={orderData.rgId}>
                            <td><Link to={"/orders/" + orderData.rgId + "/detail"}>{orderData.rgId}</Link>
                            </td>
                            <td>{orderData.orderTime}</td>
                            <td>{orderData.product.productName}</td>
                            <td>{orderData.customerId}</td>
                            <td>{orderData.product.supplier.supplierName}</td>
                            <td>{orderData.customerId}</td>
                            <td>{orderData.cancelOrder === null}</td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            <TablePagination
                component="div"
                count={state.totalItems}
                page={state.page - 1}
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

export default OrderSearchPage;