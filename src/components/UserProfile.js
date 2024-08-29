import React, { useEffect, useState } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBCardLink,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Aos from 'aos';
import { useUserAuth } from '../store';
import '../css1.css';


const UserProfile = () => {

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

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);


  const ax1 = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  });

  const userId = useUserAuth.getState().id;

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [data, setData] = useState(useUserAuth.getState());
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [productDeleted, setProductDeleted] = useState(false);
  const [productUpdated, setProductUpdated] = useState(false);
  const [favoritesNb, setFavoritesNb] = useState([]);


  const updateData = async () => {
    setIsLoading(true);
    try {
      const response = await ax1.post('/api/login', {
        email: data.email,
        password: data.password
      });
      if (response.status === 200) {
        // Handle successful response
        console.log('Login successful');
        var res1 = response.data;
        useUserAuth.setState(res1);
        setData(res1);
        // navigate('/');
      } else if (response.status === 204) {
        // Handle case where there's no data
        console.log('No data returned.');
        return false;
      }
      console.log(response)
    } catch (err) {
      console.log(err);
      return false;
    } finally {
      setIsLoading(false); // Set loading to false after request completes
    }
    setIsLoading(false);
    return true;
  }

  const validateForm = () => {
    let isValid = true;
    if (data.username.length < 3) {
      newErrors.username = "Username should be 2 or more characters";
      isValid = false;
    }
    const newErrors = { ...errors };
    // Example validation: Email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = 'Invalid email address';
      isValid = false;
    } else {
      newErrors.email = '';
    }
    // Example validation: Name is required
    if (!data.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (data.password.length < 8) {
      newErrors.password = "Username should be 8 or more characters";
      isValid = false;
    } else {
      newErrors.password = '';
    }
    setErrors(newErrors);
    return isValid;
  };


  const update1 = async (e) => {
    e.preventDefault();
    setUpdated(false);
    if (validateForm) {
      setIsLoading(true);
      setData({ ...data, register: useUserAuth.getState().registered });
      try {
        const response = await ax1.post("/api/updateUser", {
          oldUsername: useUserAuth.getState().username,
          username: data.username,
          email: data.email,
          password: data.password,
          address: data.address,
          bio: data.bio
        });
        if (response.status === 500) {
          setUpdated(false);
          setIsLoading(false)
          console.log(response);
        } else if (response.status === 200) {
          setUpdated(true);
          console.log(response);
          setIsLoading(false);
          updateData();
        }
      } catch (err) {
        setIsLoading(false)
        console.log(err);
      }
    }
  }


  const handleChange = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
  };

  const cancel = (e) => {
    e.preventDefault();
    setData(useUserAuth.getState());
  }

  const deleteProduct = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProductDeleted(false)
    const response = await ax1.post("/api/deleteProduct", {
      id: parseInt(e.target.value)
    });
    if (response.status == 500) {
      console.log(response);
      setProductDeleted(false);
    } else {
      setProductDeleted(true)
    }
    setIsLoading(false);
    // setProductDeleted(true);
  }

  const markSold = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProductUpdated(false);
    try {
      const response = await ax1.post("/api/updateProductSold", {
        id: parseInt(e.target.value),
        status: 'sold'
      });
      // console.log(response);
      setProductUpdated(true);
    } catch (err) {
      setProductUpdated(false);
      console.log(err);
    }
    setIsLoading(false);
    // setProductUpdated(!productUpdated);
  }



  //---------fetch favorites-------------

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        const favoritesnb = await ax1.get(`/api/getFavoritesNb`);
        setFavoritesNb(favoritesnb.data);
        // console.log(favoritesNb); 
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await ax1.get(`/getProducts/${userId}`);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchFavorites();
  }, [productDeleted, productUpdated]);

  //------------------


  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setProductDeleted(false);
  //     setProductUpdated(false);
  //   }, 2000); // 2000 milliseconds = 2 seconds

  //   return () => clearTimeout(timer); // Cleanup function

  // }, [favoritesNb], [productDeleted], [productUpdated]);

  // useEffect(() => {
  //   try {
  //     const response = ax1.get(`/getProducts/${userId}`);
  //     setProducts(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //     // .then(res => setProducts(res.data))
  //     // .catch(err => console.log(err));
  // }, [productDeleted, productUpdated]);

  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  if (useUserAuth.getState().id != null)
    return (
      <section className='fm-light-section'>
        {isLoading && <div className='spinner-fm-back'>
          <MDBSpinner className='m-5 spinner-fm' size="lg" role='status' color='light'>
            <span className='visually-hidden'>Loading...</span>
          </MDBSpinner>
        </div>}
        {/* css not working */}
        <MDBContainer className="py-5">
          {/* <form onSubmit={update1}> */}
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4" data-aos="fade-up">
                <p className='text-white text-center bg-success'>{(updated || productUpdated) && `Information updated successfully!`}</p>

                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle mb-2"
                    style={{ width: '150px' }}
                    fluid />
                  <h3><p className="text-muted mb-1">{useUserAuth.getState().username}</p></h3>
                  <p className="text-muted mb-4">{useUserAuth.getState().address}</p>
                  <div className="d-flex justify-content-center mb-2">
                    {useUserAuth.getState().bio}
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4" data-aos="fade-up">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Username</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput type='text' onChange={handleChange('username')} placeholder={data.username} value={data.username}>
                        {errors.username && <p className="error">{errors.username}</p>}
                      </MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput type='text' onChange={handleChange('email')} placeholder={data.email} value={data.email}></MDBInput>
                      {errors.email && <p className="error">{errors.email}</p>}
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Password</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput type='password' onChange={handleChange('password')} placeholder={data.password} value={data.password}></MDBInput>
                      {errors.password && <p className="error">{errors.password}</p>}
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput type='address' onChange={handleChange('address')} placeholder={data.address} value={data.address}></MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Bio</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput type='address' onChange={handleChange('bio')} placeholder={data.bio} value={data.bio}></MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Register Date</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput type='text' value={(useUserAuth.getState().register != null) && Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(useUserAuth.getState().register)) || ""}></MDBInput>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol>
                      <MDBBtn onClick={update1}>Edit Profile</MDBBtn>
                    </MDBCol>
                    <MDBCol>
                      <MDBBtn onClick={cancel} className='btn btn-danger'>Cancel</MDBBtn>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
              <MDBRow data-aos="fade-right">
                <MDBCol>
                  <MDBCard>
                    <MDBCardBody className='justify-content-center text-center lead'>
                      <MDBCardLink><a href='#!'><FontAwesomeIcon icon={faAdd} style={{ paddingRight: '0.7rem' }} /></a><Link to={'/AddProduct'}>Add product</Link></MDBCardLink>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
              <MDBRow data-aos="fade-up">
                <p className='text-white lead text-center mt-3 bg-success'>{productDeleted && 'product deleted successfully'}</p>
                {products != null && products.map(product => (
                  <MDBCol className='mb-4 w-20'>
                    <MDBCard className='h-100'>

                      {product.image_url != null ? (
                        <MDBCardImage
                          src={product.image_url}
                          alt={product.name}
                          position='top'
                        />
                      ) : (<p>Loading...</p>)}

                      <MDBCardBody>
                        <MDBCardTitle>{product.name}</MDBCardTitle>
                        <MDBCardText>
                          {product.details}
                          <hr />
                          Price: {product.price}
                          <hr />
                          Post Status: {
                            product.status === "accepted" ? (
                              <p className='bg-primary text-white text-center'>{product.status}</p>
                            ) : ((product.status === "rejected") ? (
                              <p class='bg-danger text-white text-center'>{product.status}</p>
                            ) : ((product.status === "pending") ? (<p class='bg-secondary text-white text-center'>{product.status}</p>) : (<p class='bg-success text-white text-center'>{product.status}</p>)))}
                          <FontAwesomeIcon icon={faStar} color='blue' title='favorites' beat /> {((favoritesNb != null) && (favoritesNb.length > 0) && (favoritesNb.find(product1 => product1.product_id === product.id)) ? (favoritesNb.find(product1 => product1.product_id === product.id).total_count) : 0)}
                        </MDBCardText>
                      </MDBCardBody>
                      <MDBCardFooter>
                        <MDBBtn onClick={deleteProduct} value={product.id} className='m-1 btn-danger'>Delete</MDBBtn>
                        <MDBBtn onClick={markSold} value={product.id} className='m-1 btn-success'>Set as Sold</MDBBtn>
                        <small className='text-muted'>{Intl.DateTimeFormat('en', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(product.date))}</small>
                      </MDBCardFooter>
                    </MDBCard>
                  </MDBCol>
                ))}
              </MDBRow>
            </MDBCol>
          </MDBRow>
          {/* </form> */}
        </MDBContainer>
      </section>
    ); else return (
      <p className='text-white text-center'>User Authorization Required</p>
    )
}

export default UserProfile;