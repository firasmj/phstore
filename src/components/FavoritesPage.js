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
  MDBSpinner
} from "mdb-react-ui-kit";
import { useUserAuth } from '../store';
import axios from 'axios';
import '../css1.css';
import Aos from 'aos';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const FavoritesPage = () => {


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
  const [isLoading, setIsLoading] = useState(false);


  const ax1 = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProducts(0);
    }, 7000); // 7000 milliseconds = 2 seconds

    return () => clearTimeout(timer); // Cleanup function

  }, [showProducts]);

  const show = (e) => {
    const id = e.target.value;
    setShowProducts(id);
  }

  const addFavorites = async (id) => {
    setIsLoading(true);
    if (favorites.length > 0 && favorites.includes(id)) {
      const response = await ax1.post("/api/removeFavorites", {
        id: id,
        userId: useUserAuth.getState().id
      });
      if (!response.ok) {
      } else {
        setFavorites(favorites.filter(item => item != id));
      }
    } else {
      const response = await ax1.post("/api/addFavorites", {
        id: id,
        userId: useUserAuth.getState().id
      });
      if (!response.ok) {
      } else {
        setFavorites(favorites.push(id));
      }
    }
    setFavoritesUpdated(!favoritesUpdated);
    setIsLoading(false);
  }


  useEffect(() => {
    const fetchFavorites = async () => {
      // ... your fetchFavorites logic
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
    };

    fetchFavorites();
  }, [favoritesUpdated], [addFavorites]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsResponse = await ax1.get(`/api/getFavoriteProducts/${favorites}`);
        setProducts(productsResponse.data);
      } catch (error) {
        console.error(error);
        // Handle errors appropriately
      }
    };

    fetchProducts();
    // }
  }, [favorites]);

  if (useUserAuth.getState().id != null)
    return (
      <MDBContainer fluid className="my-5">
        {isLoading && <div className='spinner-fm-back'>
          <MDBSpinner className='m-5 spinner-fm' size="lg" role='status' color='light'>
            <span className='visually-hidden'>Loading...</span>
          </MDBSpinner>
        </div>}
        <MDBRow>
          {products.map(product => (
            <MDBCol md="6" lg="4" xl="3" sm="6" xs="6" className="mb-4 mb-lg-0">
              <MDBCard className='h-100' data-aos="zoom-in">{showProducts == product.id ? (
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
                    <p className="text-secondary mb-0 small">{product.username}</p>
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
                    <h5 className="mb-0">{product.name}</h5>
                    <h5 className="text-dark mb-0">${product.price}</h5>
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
                    {useUserAuth.getState().username === '' && (<MDBBtn outline color="primary" size="sm" className="mt-2" value={product.id} onClick={() => addFavorites(product.id)}>Add to favorites</MDBBtn>)}
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
    ); else return (
      <p className='text-white text-center'>User Authorization Required</p>
    )
}

export default FavoritesPage;