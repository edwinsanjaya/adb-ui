import React, {useEffect, useState} from 'react';
import {Table, Col, Button, Form, FormGroup, Label, Input, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {
    Pagination,
    TablePagination,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    TextField
} from '@mui/material'

var inputLabelStyle = {
    width: "100%",
    'textAlign': 'left'
}

const constantTown = [{
    label: "kota1",
    value:"kota1-val",
    id: 1
}, {
    label: "kota2",
    value:"kota2-val",
    id: 2
}]

const constantCountry = [{
    label: "KONTRY 1",
    value:"KONTRY1-val",

    id: 1
}, {
    label: "KONTRY 2",
    value:"KONTRY2-val",
    id: 2
}]

const constantZipcode = [{
    label: "14450",
    value: "14450",
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
        value:null,
    },
    county: {
        value:null,
    },
    town: {
        value:null,
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
            value:null,
        },
        county: {
            value:null,
        },
        town: {
            value:null,
        },
        cancelled: 0,
        cancelReason: "",
        errorMap: {}
    })

    const [orders, setOrders] = useState([]);

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

        console.log('This is search')
        console.log(search)
        const data = {
            rgId: search.orderId,
            product: search.productName,
            customerId: search.customerId,
            supplier: search.supplierId,
            period: search.orderPeriod,
            zipCode: search.zipCode.value,
            county: search.county.value,
            town: search.town.value,
            cancelled: cancelled,
            // cancelReason: search.cancelReason
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
    }, [state.page, state.rng, state.size])

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

    function validateInput(value, type) {
        switch (type) {
            case 'orderPeriod': {
                let regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g
                if (!regex.test(value)) {
                    return "Is not a valid date"
                }
                break
            }
            case 'supplierId': {
                let regex = /^-?\d+$/
                if (!regex.test(value)) {
                    return "Supplier Id must be a valid number"
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
        if (anyErr.length > 0){
            alert("Found Validation Error")
            console.error(inputs.errorMap)
            return
        }

        console.log(inputs)

        search.orderId = inputs.orderId
        search.productName = inputs.productName
        search.customerId = inputs.customerId
        search.supplierId = inputs.supplierId
        search.orderPeriod = inputs.orderPeriod
        search.zipCode = inputs.zipCode
        search.county = inputs.county
        search.town = inputs.town
        search.cancelled= inputs.cancelled

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

                            <Label for="supplier_id" sm={2} style={inputLabelStyle}>Supplier ID</Label>
                            <Col sm={10}>
                                <Input type="text" name="supplierId" id="supplier_id" value={inputs.supplierId}
                                       onChange={handleInputChange}
                                       invalid={!!inputs.errorMap['supplierId']}
                                       placeholder="Search By Supplier ID"/>
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
                                    options={constantZipcode}
                                    onChange={(e, value) => {
                                        value.name = "zipCode"
                                        handleSelectAutoComplete(e, value)
                                    }}
                                    label="ZipCode"
                                    renderInput={(params) => <TextField {...params}  />}
                                />
                            </Col>

                            <Label for="county" sm={2} style={inputLabelStyle}>County</Label>
                            <Col sm={10}>
                                <Autocomplete
                                    disablePortal
                                    id="country-select"
                                    name="country"
                                    options={constantCountry}
                                    onChange={(e, value) => {
                                        value.name = "county"
                                        handleSelectAutoComplete(e, value)
                                    }}
                                    label="Town"
                                    renderInput={(params) => <TextField {...params}  />}
                                />
                            </Col>

                            <Label for="town" sm={2} style={inputLabelStyle}>Town</Label>
                            <Col sm={10}>
                                <Autocomplete
                                    disablePortal
                                    id="town-select"
                                    name="town"
                                    options={constantTown}
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
                        <tr key={orderData.rgId + orderData.customerId}>
                            <td><Link to={"/orders/" + orderData.rgId + "/detail"}>{orderData.rgId}</Link>
                            </td>
                            <td>{orderData.orderTime}</td>
                            <td>{orderData.product && orderData.product.productName}</td>
                            <td>{orderData.customerId}</td>
                            <td>{orderData.product && orderData.product.supplier && orderData.product.supplier.supplierName}</td>
                            <td>{orderData.cancelOrder.cancelReason && orderData.cancelOrder.cancelReason.length > 0 ? 'Cancelled' : 'Not Cancelled'}</td>
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