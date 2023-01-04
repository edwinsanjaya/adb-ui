import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Box, TextField, Button } from '@mui/material';
import axios from 'axios';


function QueryPage(props) {

  const [state, setState] = useState({
    field: "",
    search: "",
    results: [],
    rows: 0,
    pages: 0,
    page: 0,
    limit: 50,
  })

  async function searchQuery() {
    const url = "http://localhost:5000/query"
    await axios.post(url, { query: state.search.replace(/\n/g, " ") })
      .then(response => {
        console.log(response.data)
        setState({
          ...state,
          results: response.data
        });
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    if (state.search) {
      searchQuery()
    };
  }, [state.page, state.search])

  function handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    setState({
      ...state,
      [name]: value
    });
  }

  function handleSearch() {
    setState({
      ...state,
      search: state.field,
      page: 0
    });
  }

  function QueryTable() {
    if (state.results.length !== 0) {
      return (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {Object.keys(state.results[0]).map(function (key) {
                  return (
                    <TableCell align="right">{key}</TableCell>
                  )
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {state.results.map((result, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {Object.keys(result).map(function (key) {
                    return (
                      <TableCell align="right">{result[key]}</TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )
    }
  }

  return (
    <div>
      {/* {JSON.stringify(state)} */}
      <Box
        component="form"
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            fullWidth
            id="standard-multiline-static"
            label="Query Tools"
            multiline
            minRows={5}
            placeholder="Insert your query here"
            variant="standard"
            name="field"
            value={state.field}
            onChange={handleChange}
          />
        </div>
        <Button onClick={handleSearch} type="button">Search</Button>
      </Box>
      <div>
        <QueryTable />
      </div>
    </div>
  );
}

export default QueryPage;