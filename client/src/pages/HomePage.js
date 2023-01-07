import React, { Component, useState, useEffect } from "react";
import { styled } from '@mui/material/styles';
import {
  Grid,
  Paper,
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import axios from "axios"

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function HomePage(props) {

  const [dashboard1, setDashboard1] = useState([])
  const [dashboard2, setDashboard2] = useState([])

  const getDashboard1 = async () => {
    const url = 'http://localhost:5000/dashboard/top-ten-supplier-by-product'
    const response = await axios.get(url);
    setDashboard1(response.data)
  }

  const getDashboard2 = async () => {
    const url = 'http://localhost:5000/dashboard/top-ten-supplier-by-order'
    const response = await axios.get(url);
    setDashboard2(response.data)
  }


  useEffect(() => {
    getDashboard1()
    getDashboard2()
  }, [])

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
          <Grid item xs={6}>
            <Item>
              <h4>Top 10 Seller by Products</h4>
              {dashboard1.length !== 0 &&
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {Object.keys(dashboard1[0]).map(function (key) {
                          return (
                            <StyledTableCell align="right">{key}</StyledTableCell>
                          )
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard1.map((result, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(result).map(function (key) {
                            return (
                              <StyledTableCell align="right">{result[key]}</StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Item>
          </Grid>



          <Grid item xs={6}>
          <Item>
              <h4>Top 10 Seller by Orders</h4>
              {dashboard2.length !== 0 &&
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        {Object.keys(dashboard2[0]).map(function (key) {
                          return (
                            <StyledTableCell align="right">{key}</StyledTableCell>
                          )
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboard2.map((result, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(result).map(function (key) {
                            return (
                              <StyledTableCell align="right">{result[key]}</StyledTableCell>
                            )
                          })}
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </Item>
          </Grid>


          <Grid item xs={6}>
            <Item>3</Item>
          </Grid>


          <Grid item xs={6}>
            <Item>4</Item>
          </Grid>
        </Grid>
      </Box>
    </div>

  )

}

export default HomePage;