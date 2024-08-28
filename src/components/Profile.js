import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBContainer,
    MDBRow,
    MDBBtn,
    MDBIcon,
    MDBCard,
    MDBCardImage,
    MDBCardBody,
    MDBSpinner
} from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Aos from 'aos';
import { useUserAuth } from '../store';
import '../css1.css';
import { useParams } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';


const Profile = () => {

    const { userId } = useParams();


    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, []);


    const ax1 = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
    });

    // const userId1 = userId;
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState([]);

    const [showProducts, setShowProducts] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [favoritesUpdated, setFavoritesUpdated] = useState(false);
    const [favoritesNb, setFavoritesNb] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    ////////////////

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
            setFavoritesUpdated(!favoritesUpdated);
            setIsLoading(false);
        } else {
            navigate("/Signup");
        }
    }

    ///////////////////////

    useEffect(() => {
        const fetchFavorites = async () => {
            ax1.get(`/getUser/${userId}`)
                .then(res => setUser(res.data))
                .catch(err => console.log(err));
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
                    const productsResponse = await ax1.get(`/getProducts/${userId}`);
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
                    const productsResponse = await ax1.get(`/getProducts/${userId}`);
                    setProducts(productsResponse.data);
                } catch (error) {
                    console.error(error);
                }
            };
        }
        fetchFavorites();
        // console.log(favorites);
    }, [favoritesUpdated]);



    //showwwwwwwwwwwwwwwwwww

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

    ////////////////////////////////

    const navigate = useNavigate();

    return (
        <section className='fm-light-section'>
            {isLoading && <div className='d-flex justify-content-center spinner-fm'>
                <MDBSpinner className='m-5' size="lg" role='status' color='light'>
                    <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
            </div>}
            {/* css not working */}
            <MDBContainer className="py-5">
                <MDBRow>
                    <MDBCol lg="4">
                        <MDBCard className="mb-4" data-aos="fade-up">
                            {/* <p>{updated && `Information updated successfully!`}</p> */}

                            <MDBCardBody className="text-center">
                                <MDBCardImage
                                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                                    alt="avatar"
                                    className="rounded-circle mb-2"
                                    style={{ width: '150px' }}
                                    fluid />
                                <h3><p className="text-muted mb-1">{user.username}</p></h3>
                                <p className="text-muted mb-4">{user.address}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    {user.bio}
                                </div>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                        <MDBRow data-aos="fade-up">
                            {products.map(product => (product.status === "accepted" || product.status === "sold" ? (
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
                                                {useUserAuth.getState().username === '' && (<MDBBtn outline color="primary" size="sm" className="mt-2" value={product.id} onClick={() => addFavorites(product.id)}><p><small className='mx-2'><FontAwesomeIcon icon={faStar} color='blue' title='favorites' beat className='mx-1' />{((favoritesNb != null) && (favoritesNb.length > 0) && (favoritesNb.find(product1 => product1.product_id === product.id)) ? (favoritesNb.find(product1 => product1.product_id === product.id).total_count) : 0)}</small>Add to favorites</p></MDBBtn>)}
                                            </div>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            ) : (<div></div>)))}
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </section>
    );
}

export default Profile;