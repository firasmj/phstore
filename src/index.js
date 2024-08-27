import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Nav1 from './components/Nav1';
import Signup from './components/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer1 from './components/Footer1';
import { UserProvider } from './components/UserContext';
import UserProfile from './components/UserProfile';
import AddProduct from './components/AddProduct';
import AdminPage from './components/AdminPage';
import AdminSignup from './components/AdminSignup';
import Register from './components/Register';
import Profile from './components/Profile';
import ProductsPage from './components/ProductsPage';
import FavoritesPage from './components/FavoritesPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <Router>
        <Nav1 />
        <Routes>
          <Route path="/UserProfileBoots" element={<UserProfile />} />
          <Route path="/" element={<App />} />
          <Route path='/ProductsPage' element={<ProductsPage/>} />
          <Route path='/FavoritesPage' element={<FavoritesPage/>} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Register" element={<Register />} />
          <Route path='/AddProduct' element={<AddProduct />} />
          <Route path='/AdminPage' element={<AdminPage />} />
          <Route path='/AdminSignup' element={<AdminSignup />} />
          <Route path="/Profile/:userId" element={<Profile/>}/>
        </Routes>
        <Footer1 />
      </Router>
    </UserProvider>

  </React.StrictMode>
);

reportWebVitals();
