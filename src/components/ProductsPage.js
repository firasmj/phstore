import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBBtn,
  MDBBtnGroup,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem
} from "mdb-react-ui-kit";
import { useUserAuth } from '../store';
import axios from 'axios';
import '../css1.css';
import Aos from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { MDBSpinner } from 'mdb-react-ui-kit';

const ProductsPage = () => {

  const retrieveState = () => {
    const storedState = localStorage.getItem('userAuthState');
    console.log(storedState);
    return storedState != null ? JSON.parse(storedState) : {
      id: null,
      username: '',
      email: '',
      password: '',
      registered: '',
      address: '',
      bio: ''
    };
  }
  useUserAuth.setState(retrieveState);

  const navigate = useNavigate();

  useEffect(() => {
    Aos.init({
      offset: 100, // Offset from the top of the page
      delay: 50, // Delay in milliseconds
      duration: 700, // Duration of the animation in milliseconds
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      once: true // Whether to animate elements only once
    });
  }, []);

  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [favoritesUpdated, setFavoritesUpdated] = useState(false);
  const [favoritesNb, setFavoritesNb] = useState([]);
  const [sortMethod, setSortMethod] = useState('');
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const ax1 = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProducts(0);
    }, 7000); // 2000 milliseconds = 2 seconds

    return () => clearTimeout(timer); // Cleanup function

  }, [showProducts]);

  const show = (e) => {
    const id = e.target.value;
    setShowProducts(id);
  }

  const addFavorites = async (id) => {
    // const id = e.target.value;
    // console.log(id);
    setIsLoading(true);
    if (useUserAuth.getState().username != '') {
      if (favorites.length > 0 && favorites.includes(id)) {
        const response = await ax1.post("/api/removeFavorites", {
          id: id,
          userId: useUserAuth.getState().id
        });
        if (!response.ok) {
          // console.log(response);
        } else {
          setFavorites(favorites.filter(item => item != id));
          // setFavoritesUpdated(true);
        }
      } else {
        const response = await ax1.post("/api/addFavorites", {
          id: id,
          userId: useUserAuth.getState().id
        });
        if (!response.ok) {
          // console.log(response);
        } else {
          setFavorites(favorites.push(id));
          // setFavoritesUpdated(true);
        }
      }
      // setFavoritesUpdated(false);
      setSortMethod('');
      setFavoritesUpdated(!favoritesUpdated);
      setIsLoading(false);
    } else {
      navigate("/Signup");
    }
  }



  useEffect(() => {
    const fetchFavorites = async () => {
      if (useUserAuth.getState().username !== '') {
        try {
          const favoritesResponse = await ax1.get(`/api/getfavorites/${useUserAuth.getState().id}`);
          setFavorites(favoritesResponse.data);
        } catch (err) {
          console.log(err);
        }
        try {
          const favoritesnb = await ax1.get(`/api/getFavoritesNb`);
          setFavoritesNb(favoritesnb.data);
          // console.log(favoritesNb);
        } catch (error) {
          console.log(error);
        }
        try {
          const productsResponse = await ax1.get('/api/getAllProducts');
          setProducts(productsResponse.data);
        } catch (error) {
          console.error(error);
          // Handle errors appropriately
        }
      } else {
        try {
          const favoritesnb = await ax1.get(`/api/getFavoritesNb`);
          setFavoritesNb(favoritesnb.data);
          // console.log(favoritesNb);
        } catch (error) {
          console.log(error);
        }
        try {
          const productsResponse = await ax1.get('/api/getAllProducts');
          setProducts(productsResponse.data);
        } catch (error) {
          console.error(error);
        }
      };
    }
    fetchFavorites();
    // console.log(favorites);
  }, [favoritesUpdated]); // Dependency for username change

  const types = [
    "all",
    "Mobiles and Accessories",
    "Vehicles",
    "Properties",
    "Electronics and Appliances",
    "Furniture and Decor",
    "Business and Industrial",
    "Pets",
    "Kids and Babies",
    "Sports and Equipment",
    "Hobbies, Music, Arts, and Books",
    "Jobs",
    "Fashion and Beauty",
    "Services",
    "Other"
  ];

  const sort1 = async (sort) => {
    setIsLoading(true);
    // setFilter('');
    // console.log(sort);
    if (sort == 'none') {
      setSortMethod('');
      // setProducts('');
      // setFavoritesUpdated(!favoritesUpdated);
    } else if (sort == 'stars') {
      try {
        setSortMethod(sort)
        console.log((favoritesNb.find(product1 => product1.product_id === products[0].id)) ? (favoritesNb.find(product1 => product1.product_id === products[0].id).total_count) : 0);
        const sortFunction = (a, b) => {
          const c = ((favoritesNb.find(product1 => product1.product_id === a.id)) ? (favoritesNb.find(product1 => product1.product_id === a.id).total_count) : 0);
          const d = ((favoritesNb.find(product1 => product1.product_id === b.id)) ? (favoritesNb.find(product1 => product1.product_id === b.id).total_count) : 0);
          if (c > d) return -1
          else if (c < d) return 1
          else return 0
        }

        const products2 = products.sort(sortFunction);
        setProducts(products2);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSortMethod(sort);
      // console.log(sort);
      // if (useUserAuth.getState().username == '') {
      const response = await ax1.get(`/api/getAllProductsSort`, {
        params: {
          sort: sort,
          filter: filter
        }
      });
      setProducts(response.data);
      // }
    }
    setIsLoading(false);
  }

  const filter1 = async (e) => {
    const filter2 = e.target.value;
    setIsLoading(true);
    // console.log(filter2);
    setSortMethod('');
    if (filter2 == 'all') {
      setFilter('');
      setFavoritesUpdated(!favoritesUpdated);
    } else {
      setFilter(filter2);
      const response = await ax1.get(`/api/getProductsByType/${filter2}`);
      setProducts(response.data);
    }
    setIsLoading(false);
  }

  return (
    <MDBContainer fluid className="my-5 pt-4">
      {isLoading && <div className='spinner-fm-back'>
        <MDBSpinner className='m-5 spinner-fm' size="lg" role='status' color='light'>
          <span className='visually-hidden'>Loading...</span>
        </MDBSpinner>
      </div>}
      <MDBRow className='m-auto'>
        <MDBCol lg={12} className='text-center mb-3'>
          {/* <MDBBtnGroup>
              <MDBDropdown>
                <MDBDropdownToggle>Filter by Type</MDBDropdownToggle>
                <MDBDropdownMenu> */}
          <Form.Select className='text-center m-auto w-auto mb-1' aria-label="Default select example" required onChange={filter1}>
            <option value="all" selected disabled>Select Product Type</option>
            {types.map(type => (
              <option value={type}>{type}</option>
            ))}
          </Form.Select>
          {/* <MDBDropdownItem value="value" link>Dropdown link</MDBDropdownItem>
                  <MDBDropdownItem link>Dropdown link</MDBDropdownItem> */}
          {/* </MDBDropdownMenu>
              </MDBDropdown>
            </MDBBtnGroup> */}
          <MDBBtnGroup aria-label='Basic example'>
            {/* <p className='text-white m-auto px-2'>Sort By</p> */}
            {sortMethod == '' ? <MDBBtn size="sm" onClick={() => sort1('none')}>None</MDBBtn> : <MDBBtn size="sm" onClick={() => sort1('none')} color='secondary'>None</MDBBtn>}
            {sortMethod == 'stars' ? <MDBBtn size="sm" onClick={() => sort1('stars')} active>By Stars</MDBBtn> : <MDBBtn size="sm" onClick={() => sort1('stars')} color='secondary'>Stars</MDBBtn>}
            {sortMethod == 'p.price ASC' ? <MDBBtn size="sm" onClick={() => sort1('p.price ASC')} active>Price Low-high</MDBBtn> : <MDBBtn size="sm" onClick={() => sort1('p.price ASC')} color='secondary'>Price Low-high</MDBBtn>}
            {sortMethod == 'p.price DESC' ? <MDBBtn size="sm" onClick={() => sort1('p.price DESC')} active>Price High-Low</MDBBtn> : <MDBBtn size="sm" onClick={() => sort1('p.price DESC')} color='secondary'>Price High-Low</MDBBtn>}
            {sortMethod == 'p.id DESC' ? <MDBBtn size="sm" onClick={() => sort1('p.id DESC')} active>latest</MDBBtn> : <MDBBtn size="sm" onClick={() => sort1('p.id DESC')} color='secondary'>latest</MDBBtn>}
          </MDBBtnGroup>
        </MDBCol>
        {products.map(product => (
          <MDBCol className="mb-2 px-0">
            <MDBCard style={{ width: '10.3rem', fontSize: 'x-small' }} size="sm" className='h-100' data-aos="zoom-in">{showProducts == product.id ? (
              <div className="d-flex bg-primary text-white justify-content-between p-3 m-3">
                <p className="small mb-0">{product.details}</p>
              </div>
            ) : (
              <div className="d-flex justify-content-between p-3">
                <p className="lead mb-0">{product.name}</p>
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center shadow-1-strong"
                  style={{ width: "70px", height: "20px" }}
                >
                  <p className="text-secondary mb-0 small"><Link to={`/Profile/${product.user_id}`}>{product.username}</Link></p>
                </div>
              </div>
            )}
              <MDBCardImage
                src={product.image_url}
                position="top"
                alt={product.type}
              />
              <MDBCardBody>
                <div className="d-flex justify-content-between">
                  <p className="small">
                    <a href="#!" className="text-muted">
                      {product.type}
                    </a>
                  </p>
                  <p className="small text-danger">
                    <s>${(parseInt(product.price) + parseInt(product.price * 0.2))}</s>
                  </p>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <h6 className="mb-0" style={{ fontSize: '0.95rem' }}>{product.name}</h6>
                  <h6 className="text-dark mb-0 mx-1" style={{ fontSize: '0.9rem' }}>${product.price}</h6>
                </div>

                <div class="d-flex justify-content-between mb-2">
                  <p class="text-muted mb-0">
                    Available: <span class="fw-bold">{product.quantity}</span>
                  </p>
                  <div class="ms-auto text-warning">
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                    <MDBIcon fas icon="star" />
                  </div>
                </div>
                <div className="d-flex flex-column mt-4">
                  <MDBBtn color="primary" size="sm" value={product.id} onClick={show}>
                    Details
                  </MDBBtn>
                  {useUserAuth.getState().username !== '' ? ((favorites.length > 0 && favorites.includes(product.id)) ? (
                    <MDBBtn color="primary" size="sm" className="mt-2" value={product.id} onClick={() => addFavorites(product.id)}>
                      <p><small className='mx-2'><FontAwesomeIcon icon={faStar} color='white' title='favorites' beat className='mx-1' />{((favoritesNb != null) && (favoritesNb.length > 0) && (favoritesNb.find(product1 => product1.product_id === product.id)) ? (favoritesNb.find(product1 => product1.product_id === product.id).total_count) : 0)} </small>Remove from favorites</p></MDBBtn>
                  ) : (
                    <MDBBtn outline color="primary" size="sm" className="mt-2" value={product.id} onClick={() => addFavorites(product.id)}>
                      <p><small className='mx-2'><FontAwesomeIcon icon={faStar} color='blue' title='favorites' beat className='mx-1' />{((favoritesNb != null) && (favoritesNb.length > 0) && (favoritesNb.find(product1 => product1.product_id === product.id)) ? (favoritesNb.find(product1 => product1.product_id === product.id).total_count) : 0)}</small>Add to favorites</p></MDBBtn>
                  )) : (<></>
                  )}
                  {useUserAuth.getState().username === '' && (<MDBBtn outline color="primary" size="sm" className="mt-2" value={product.id} onClick={() => addFavorites(product.id)}><p><small className='mx-2'><FontAwesomeIcon icon={faStar} color='blue' title='favorites' beat className='mx-1' />{((favoritesNb != null) && (favoritesNb.length > 0) && (favoritesNb.find(product1 => product1.product_id === product.id)) ? (favoritesNb.find(product1 => product1.product_id === product.id).total_count) : 0)}</small>Add to favorites</p></MDBBtn>)}
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        ))}
      </MDBRow>
    </MDBContainer>
  )
}
export default ProductsPage;