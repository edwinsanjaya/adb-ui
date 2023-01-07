import React, {useEffect, useState} from 'react';
import {Table, Col, Button, Form, FormGroup, Label, Input, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import CancelReason from '../constants/cancelReason';

import {
    Pagination,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    TextField, TableCell
} from '@mui/material'

var inputLabelStyle = {
    width: "100%",
    'textAlign': 'left'
}

const constantZipcode = [{
    label: "111",
    value: "111",
    id: 1
}, {
    label: "12345",
    value: "12345",
    id: 2
}]

var search = {
    orderId: "",
    productName: "",
    customerId: "",
    supplierId: "",
    orderPeriod: "",
    zipCode: {
        value: null,
    },
    county: {
        value: null,
    },
    town: {
        value: null,
    },
    cancelled: 0,
    cancelReason: "",
    pages: 0,
}

function OrderSearchPage(props) {
    const [state, setState] = useState({
        totalItems: 0,
        page: 1,
        size: 50,
        rng: "",
    })

    const [inputs, setInputs] = useState({
        orderId: "",
        productName: "",
        customerId: "",
        supplierId: "",
        orderPeriod: "",
        zipCode: {
            value: null,
        },
        county: {
            value: null,
        },
        town: {
            value: null,
        },
        cancelled: 0,
        cancelReason: "",
        errorMap: {}
    })

    const [orders, setOrders] = useState([]);

    const [counties, setCounties] = useState([]);
    const [towns, setTowns] = useState([]);
    const [zipCodes, setZipCodes] = useState([]);

    async function searchOrders() {
        const url = 'http://localhost:5000/orders/filter'
        let cancelled = null
        switch (search.cancelled) {
            case 1:
                cancelled = true
                break
            case 2:
                cancelled = false
                break
        }
        let data = {
            rgId: !!search.orderId ? search.orderId : null,
            product: !!search.productName ? search.productName : null,
            customerId: !!search.customerId ? search.customerId : null,
            supplier: !!search.supplierId ? search.supplierId : null,
            period: !!search.orderPeriod ? new Date(search.orderPeriod).valueOf() : null,
            zipCode: search.zipCode.value,
            county: search.county.value,
            town: search.town.value,
            cancelled: cancelled,
            cancelReason: !!search.cancelReason ? search.cancelReason : null
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
        searchZipCode();
    }, [state.page, state.rng, state.size])

    useEffect(() => {
        searchCounty();
    }, [])

    async function searchCounty() {
        const url = 'http://localhost:5000/regions/county'

        const response = await axios.get(url, {});

        let results = response.data.map(val => {
            return {
                ...val,
                label: val.countyeng,
                value: val.countyeng,
            }
        })
        setCounties(results)
    }

    async function searchTownByCounty(countyName) {
        const url = 'http://localhost:5000/regions/counties/' + countyName + '/towns'

        const response = await axios.get(url, {});

        let results = response.data.map(val => {
            return {
                ...val,
                key: val.towneng,
                label: val.towneng,
                value: val.towneng,
            }
        })
        setTowns(results)
    }

    async function searchZipCode() {
        const url = 'http://localhost:5000/regions/zipcodes'
        const response = await axios.get(url, {});

        let results = response.data.map(val => {
            return {
                ...val,
                label: val.zipcode,
                value: val.zipcode,
            }
        })
        setZipCodes(results)
    }

    function handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name
        let errorMap = inputs.errorMap
        errorMap[name] = validateInput(value, name)
        setInputs({
            ...inputs,
            errorMap: errorMap,
            [name]: value
        })
    }

    function handleSelectAutoComplete(event, value) {
        const name = value.name
        setInputs({
            ...inputs,
            [name]: value
        })
    }

    function handleSelectZipCodes(event, value) {
        const name = value.name
        let county = {
            countyid: value.countyid,
            countyeng: value.countyeng,
            label: value.countyeng,
            value: value.countyeng,
            name: 'county'
        }
        let town = {
            towneng: value.townid,
            key: value.towneng,
            label: value.towneng,
            value: value.towneng,
            name: 'town'
        }
        setInputs({
            ...inputs,
            county: county,
            town: town,
            [name]: value
        })
        searchTownByCounty(value.countyeng)
    }

    function validateInput(value, type) {
        switch (type) {
            case 'orderPeriod': {
                let regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g
                if (!regex.test(value)) {
                    return "Is not a valid date"
                }
                break
            }
            case 'shippingZipCode': {
                let regex = /^-?\d+$/
                if (!regex.test(value)) {
                    return "Shipping Zip Code must be a valid number"
                }
                break
            }
        }
    }


    function handleSearch(event) {
        const anyErr = Object.keys(inputs.errorMap).filter(key => !!inputs.errorMap[key])
        if (anyErr.length > 0) {
            alert("Found Validation Error")
            console.error(inputs.errorMap)
            return
        }

        search.orderId = inputs.orderId
        search.productName = inputs.productName
        search.customerId = inputs.customerId
        search.supplierId = inputs.supplierId
        search.orderPeriod = inputs.orderPeriod
        search.zipCode = inputs.zipCode
        search.county = inputs.county
        search.town = inputs.town
        search.cancelled = inputs.cancelled
        search.cancelReason = inputs.cancelReason

        setState({
            ...state,
            page: 1,
            rng: state.rng + 1
        });
    }

    function changePage(event, value) {
        const nextPage = value + 1
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
            <Form>
                <FormGroup row>
                    <div style={{display: 'flex'}}>
                        <div style={{width: '100%'}}>
                            <div>
                                <Label for="order_id" sm={2} style={inputLabelStyle}>Order ID</Label>
                                <Col sm={10}>
                                    <Input type="text" name="orderId" id="order_id" value={inputs.orderId}
                                           onChange={handleInputChange} placeholder="Search By Order ID"/>
                                </Col>
                            </div>

                            <Label for="product_name" sm={2} style={inputLabelStyle}>Product Name</Label>
                            <Col sm={10}>
                                <Input type="text" name="productName" id="product_name" value={inputs.productName}
                                       onChange={handleInputChange} placeholder="Search Product Name"/>
                            </Col>

                            <Label for="customer_id" sm={2} style={inputLabelStyle}>Customer ID</Label>
                            <Col sm={10}>
                                <Input type="text" name="customerId" id="customer_id" value={inputs.customerId}
                                       onChange={handleInputChange} placeholder="Search Customer ID"/>
                            </Col>

                            <Label for="supplier_id" sm={2} style={inputLabelStyle}>Supplier ID/ Name</Label>
                            <Col sm={10}>
                                <Input type="text" name="supplierId" id="supplier_id" value={inputs.supplierId}
                                       onChange={handleInputChange}
                                       invalid={!!inputs.errorMap['supplierId']}
                                       placeholder="Search By Supplier ID/Name"/>
                                <FormFeedback
                                    style={inputLabelStyle}
                                    text={inputs.errorMap['supplierId']}>{inputs.errorMap['supplierId']}</FormFeedback>
                            </Col>

                            <Label for="order_period" sm={1} style={inputLabelStyle}>Order Period</Label>
                            <Col sm={10}>
                                <Input type="text" name="orderPeriod" id="order_period" value={inputs.orderPeriod}
                                       onChange={handleInputChange} placeholder="Input Order Period (YYYY-MM-DD)"
                                       invalid={!!inputs.errorMap['orderPeriod']}/>
                                <FormFeedback
                                    style={inputLabelStyle}
                                    text={inputs.errorMap['orderPeriod']}>{inputs.errorMap['orderPeriod']}</FormFeedback>
                            </Col>
                        </div>
                        <div style={{width: '100%'}}>
                            <Label for="shipping_zip_code" sm={2} style={inputLabelStyle}>Shipping Zip Code</Label>
                            <Col sm={10}>
                                <Autocomplete
                                    disablePortal
                                    id="zipcode-select"
                                    name="zipcode"
                                    options={zipCodes}
                                    onChange={(e, value) => {
                                        value.name = "zipCode"
                                        handleSelectZipCodes(e, value)
                                    }}
                                    label="ZipCode"
                                    renderInput={(params) => <TextField {...params}  />}
                                />
                            </Col>

                            <Label for="county" sm={2} style={inputLabelStyle}>County</Label>
                            <Col sm={10}>
                                <Autocomplete
                                    disablePortal
                                    id="county-select"
                                    name="county"
                                    value={inputs.county.value}
                                    options={counties}
                                    onChange={(e, val) => {
                                        val.name = "county"
                                        handleSelectAutoComplete(e, val)
                                        searchTownByCounty(val.value)
                                    }}
                                    label="County"
                                    renderInput={(params) => <TextField {...params}  />}
                                />
                            </Col>

                            <Label for="town" sm={2} style={inputLabelStyle}>Town</Label>
                            <Col sm={10}>
                                <Autocomplete
                                    disablePortal
                                    disabled={inputs.county === null}
                                    id="town-select"
                                    name="town"
                                    value={inputs.town.value}
                                    options={towns}
                                    onChange={(e, value) => {
                                        value.name = "town"
                                        handleSelectAutoComplete(e, value)
                                    }}
                                    label="Town"
                                    renderInput={(params) => <TextField {...params}  />}
                                />
                            </Col>

                            <Label for="is_cancelled" sm={2} style={inputLabelStyle}>Is Cancelled</Label>
                            <Col sm={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="is_cancelled">Is Canceled</InputLabel>
                                    <Select
                                        name="cancelled"
                                        labelId="is_cancelled"
                                        id="is_cancelled-select"
                                        value={inputs.cancelled}
                                        label="isCancelled"
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value={0}>N/A</MenuItem>
                                        <MenuItem value={1}>Cancelled</MenuItem>
                                        <MenuItem value={2}>Not Cancelled</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>

                            <Label for="cancel_reason" sm={2} style={inputLabelStyle}>Cancel Reason</Label>
                            <Col sm={10}>
                                <FormControl fullWidth>
                                    <InputLabel id="cancel_reason">Cancel Reason</InputLabel>
                                    <Select
                                        disabled={inputs.cancelled !== 1}
                                        name="cancelReason"
                                        labelId="cancel_reason"
                                        id="canceled_reason"
                                        value={inputs.cancelReason}
                                        label="cancelReason"
                                        onChange={handleInputChange}
                                    >
                                        {
                                            CancelReason.map(reason => {
                                                return (<MenuItem value={reason} key={reason}>{reason}</MenuItem>)
                                            })
                                        }
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
                    <th scope="col">Order ID</th>
                    <th scope="col">Order Time</th>
                    <th scope="col">Product</th>
                    <th scope="col">Customer ID</th>
                    <th scope="col">Supplier</th>
                    <th scope="col">Status</th>
                </tr>
                </thead>
                <tbody>
                {orders?.map((orderData) => {
                    return (
                        <tr key={orderData.rgId + '-' + orderData.rmId + '-' + orderData.rsId + '-' + Math.random()}>
                            <td><Link to={"/orders/" + orderData.rgId + "/detail"}>{orderData.rgId}</Link>
                            </td>
                            <td>{orderData.orderTime && new Date(orderData.orderTime).toLocaleString()}</td>
                            <td>{orderData.product && orderData.product.productName}</td>
                            <td>{orderData.customerId}</td>
                            <td>{orderData.product && orderData.product.supplier && orderData.product.supplier.supplierName}</td>
                            <td>{orderData.cancelOrder && orderData.cancelOrder.cancelReason && orderData.cancelOrder.cancelReason.length > 0 ? 'Cancelled - ' + orderData.cancelOrder.cancelReason : 'Not Cancelled'}</td>
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
        </div>
    );
}

export default OrderSearchPage;