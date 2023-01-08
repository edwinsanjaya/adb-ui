import React, {useEffect, useState} from 'react';
import {Table, Col, Button, Form, FormGroup, Label, Input, FormText, FormFeedback} from 'reactstrap';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Autocomplete, Pagination, TablePagination, TextField} from '@mui/material'

var search = {
    supplierName: "",
    orderPeriod: "",
    county: {
        value: ''
    },
    town: {
        value: ''
    },
    zipCode: {
        value: ''
    },
    pages: 0,
}

function SupplierSearchPage(props) {

    const [state, setState] = useState({
        totalItems: 0,
        page: 1,
        size: 50,
        rng: 1,
    })

    const [inputs, setInputs] = useState({
        supplierName: "",
        orderPeriod: "",
        errorMap: {},
        county: {
            value: ''
        },
        town: {
            value: ''
        },
        zipCode: {
            value: ''
        }
    })

    const [suppliers, setSuppliers] = useState([]);
    const [counties, setCounties] = useState([]);
    const [towns, setTowns] = useState([]);
    const [zipCodes, setZipCodes] = useState([]);

    async function searchSuppliers() {
        const url = 'http://localhost:5000/suppliers/filter'
        const data = {
            taiwanCounty: !!search.county.value ? search.county.value : null,
            taiwanTown: !!search.town.value ? search.town.value : null,
            name: !!search.supplierName ? search.supplierName : null,
            orderPeriod: !!search.orderPeriod ? search.orderPeriod : null,
            zipCode: !!search.zipCode.value ? search.zipCode.value : null
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
        setSuppliers(response.data.content)
        setState({
            ...state,
            totalItems: response.data.metadata.totalItems,
            page: parseInt(response.data.metadata.page, 10),
            size: parseInt(response.data.metadata.size, 10),
        })
        search.pages = Math.ceil(state.totalItems / state.size)
    }

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

    useEffect(() => {
        searchZipCode();
        searchCounty();
    }, [])

    useEffect(() => {
        searchSuppliers();
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
        });
    }

    function handleSelectCounty(event, value) {
        const name = value.name
        setInputs({
            ...inputs,
            zipCode: {
                value: null
            },
            town: {
                value: null
            },
            [name]: value
        })
    }

    function handleSelectTown(event, value) {
        const name = value.name
        setInputs({
            ...inputs,
            zipCode: {
                value: null
            },
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
        }
    }

    function handleSearch(event) {
        search.supplierName = inputs.supplierName
        search.county = inputs.county
        search.town = inputs.town
        search.orderPeriod = inputs.orderPeriod
        search.zipCode = inputs.zipCode
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
            {/*<div>State: {JSON.stringify(state)}</div>*/}
            <div>Input: {JSON.stringify(inputs)}</div>
            }
            <Form>
                <FormGroup row>
                    <Label for="supplier_name" sm={2}>Supplier Name</Label>
                    <Col sm={10}>
                        <Input type="text" name="supplierName" id="supplier_name" value={inputs.supplierName}
                               onChange={handleInputChange} placeholder="Search by Supplier Name"/>
                    </Col>

                    {/*<Label for="taiwan_county" sm={2}>County</Label>*/}
                    {/*<Col sm={10}>*/}
                    {/*  <Input type="text" name="taiwanCounty" id="taiwan_county" value={inputs.taiwanCounty} onChange={handleInputChange} placeholder="Search by Taiwan County" />*/}
                    {/*</Col>*/}

                    <Label for="shipping_zip_code" sm={2}>Shipping Zip Code</Label>
                    <Col sm={10}>
                        <Autocomplete
                            disablePortal
                            id="zipCode-select"
                            name="zipCode"
                            options={zipCodes}
                            value={inputs.zipCode.value}
                            onChange={(e, val) => {
                                val.name = "zipCode"
                                handleSelectZipCodes(e, val)
                            }}
                            label="ZipCode"
                            renderInput={(params) => <TextField {...params}  />}
                        />
                    </Col>

                    <Label for="county" sm={2}>County</Label>
                    <Col sm={10}>
                        <Autocomplete
                            disablePortal
                            id="county-select"
                            name="county"
                            value={inputs.county.value}
                            options={counties}
                            onChange={(e, val) => {
                                val.name = "county"
                                handleSelectCounty(e, val)
                                searchTownByCounty(val.value)
                            }}
                            label="County"
                            renderInput={(params) => <TextField {...params}  />}
                        />
                    </Col>

                    <Label for="town" sm={2}>Town</Label>
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
                                handleSelectTown(e, value)
                            }}
                            label="Town"
                            renderInput={(params) => <TextField {...params}  />}
                        />
                    </Col>

                    <Label for="order_period" sm={2}>Order Period</Label>
                    <Col sm={10}>
                        <Input type="text" name="orderPeriod" id="order_period" value={inputs.orderPeriod}
                               onChange={handleInputChange} placeholder="Input Order Period (YYYY-MM-DD)"
                               invalid={!!inputs.errorMap['orderPeriod']}/>
                        <FormFeedback
                            style={{textAlign: 'left'}}
                            text={inputs.errorMap['orderPeriod']}>{inputs.errorMap['orderPeriod']}</FormFeedback>
                    </Col>
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
                {suppliers?.map((supplier) => {
                    return (
                        <tr key={supplier.supplierId}>
                            <td>{supplier.supplierId}</td>
                            <td><Link to={"/supplier/" + supplier.supplierId + "/detail"}>{supplier.supplierName}</Link>
                            </td>
                            <td>{supplier.supplierAddress}</td>
                            <td>{supplier.totalOrderCount}</td>
                            <td>{supplier.totalProductCount}</td>
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

export default SupplierSearchPage;