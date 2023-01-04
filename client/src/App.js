import logo from './logo.svg';
import './App.css';
import { Container } from 'reactstrap'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'

import Header from './components/Header.js'
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductSearchPage from './pages/ProductSearchPage';
import ProductDetailPage from './pages/ProductDetailPage';
import TestMapPage from './pages/TestMapPage';


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Container>
          <Routes>
            <Route exact path="/" element={<HomePage/>} />
            <Route exact path="/products" element={<ProductListPage/>}/>
            <Route exact path="/products/search" element={<ProductSearchPage/>}/>
            <Route exact path="/product/:product_id/detail" element={<ProductDetailPage/>}/>
            <Route exact path="/map/test" element={<TestMapPage/>}/>
          </Routes>
        </Container>
        {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
