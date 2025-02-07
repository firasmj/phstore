
import './App.css';
import './css1.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ProductCard from './components/ProductCard';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useUserAuth } from './store';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const App = () => {

  const responsive = {
    superLargeDesktop: { breakpoint: { min: 1601 }, items: 6 },
    desktop: { breakpoint: { max: 1600, min: 1250 }, items: 4 },
    largeTablet: { breakpoint: { max: 1249, min: 901 }, items: 3 },
    tablet: { breakpoint: { max: 900, min: 641 }, items: 2 },
    tabletsmall: { breakpoint: { max: 640, min: 401 }, items: 1 },
    mobile: { breakpoint: { max: 400, min: 0 }, items: 1 },
  };


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
  // const initialState = useUserAuth.retrieveState();
  useEffect(() => {
    useUserAuth.setState(retrieveState);
  },[]);
  // useUserAuth.setState(initialState || {});


  const [products, setProducts] = useState([]);
  const [mobilesElectronics, setMobilesElectronics] = useState([]);
  const [fashion, setFashion] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [usernames2, setUsernames2] = useState([]);

  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  });

  useEffect(() => {
    const getUsernames = async () => {
      await axiosInstance.get('/usernames')
        .then(response => setUsernames2(response.data))
        // .then(response => console.log(response.data))
        .catch(err => console.log(err));
    }
    getUsernames();
  }, []);

  useEffect( () => {
    const getProducts = async () => {
       axiosInstance.get('/products/latest')
        .then(response => setProducts(response.data))
        // .then(response => console.log(response.data))
        .catch(err => console.log(err));
    }

    const getMobiles = async () => {
       axiosInstance.get('/api/productsMobilesElectronics')
      .then(response => setMobilesElectronics(response.data))
      // .then(response => console.log(response.data))
      .catch(err => console.log(err));
    }

    const getFashion = async () => {
       axiosInstance.get('/api/productsFashion')
      .then(response => setFashion(response.data))
      // .then(response => console.log(response.data))
      .catch(err => console.log(err));
    }

    const all = async () => {
      await getProducts(); await getMobiles(); await getFashion();
    }

    all();

  }, []);

  // useEffect(() => {
  //   axiosInstance.get('/api/productsMobilesElectronics')
  //     .then(response => setMobilesElectronics(response.data))
  //     // .then(response => console.log(response.data))
  //     .catch(err => console.log(err));
  // }, []);

  // useEffect(() => {
  //   axiosInstance.get('/api/productsFashion')
  //     .then(response => setFashion(response.data))
  //     // .then(response => console.log(response.data))
  //     .catch(err => console.log(err));
  // }, []);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <div className='mt-5 pt-4'>
      <div className='cont1'>
        <div className='containerhz1' style={{ background: 'none', padding: '0', margin: '0' }}>
          <h2 className='welcomeh1' data-aos="fade-up">
            <p> Welcome {useUserAuth.getState().id != null ? (useUserAuth.getState().username) : <></>}</p>
          </h2>
        </div>
        <hr />

        <div className='containerhz1'>
          <h2 style={{ paddingBottom: '1.3rem', marginTop: '1.5rem' }} data-aos="fade-up">
            Latest Products
          </h2>
          <div className="d-flex justify-content-end mx-5">
            <Button className='shadow' style={{ backgroundColor: '#ffffff', border: '0' }}><Link to={`/ProductsPage`} className='text-decoration-none text-blue'>See More</Link></Button>
          </div>
          <Carousel
            swipeable={true}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2500}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={false}
            // deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            rewind="true"
            rewindWithAnimation="true"
          >
            {products != [] && products.map(product => (
              //<p key={user.id}>{user.name}</p>
              ((product.status == "accepted") && (product.visibility == 1) && <ProductCard key={product.id} item={product} />)
            ))}
          </Carousel>
        </div>

        <div className='containerhz1'>
          <h2 style={{ paddingBottom: '1.3rem', marginTop: '1.5rem' }} data-aos="fade-up">
            Mobiles and Electronics
          </h2>
          <div className="d-flex justify-content-end mx-5">
            <Button className='shadow' style={{ backgroundColor: '#ffffff', border: '0' }}><Link to={`/ProductsPage`} className='text-decoration-none text-blue'>See More</Link></Button>
          </div>
          <Carousel
            swipeable={true}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2500}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={false}
            // deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            rewind="true"
            rewindWithAnimation="true"
          >
            {mobilesElectronics != [] && mobilesElectronics.map(product => (
              //<p key={user.id}>{user.name}</p>
              ((product.status == "accepted") && (product.visibility == 1) && <ProductCard key={product.id} item={product} />)
            ))}
          </Carousel>
        </div>

        <div className='containerhz1'>
          <h2 style={{ paddingBottom: '1.3rem', marginTop: '1.5rem' }} data-aos="fade-up">
            Fashion and Beauty
          </h2>
          <div className="d-flex justify-content-end mx-5">
            <Button className='shadow' style={{ backgroundColor: '#ffffff', border: '0' }}><Link to={`/ProductsPage`} className='text-decoration-none text-blue'>See More</Link></Button>
          </div>
          <Carousel
            swipeable={true}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2500}
            keyBoardControl={true}
            customTransition="transform 300ms ease-in-out"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={false}
            // deviceType={this.props.deviceType}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            rewind="true"
            rewindWithAnimation="true"
          >
            {fashion != [] && fashion.map(product => (
              //<p key={user.id}>{user.name}</p>
              ((product.status == "accepted") && (product.visibility == 1) && <ProductCard key={product.id} item={product} />)
            ))}
          </Carousel>
        </div>

        <div className='jumbotron jumbotron-fluid mt-4 mx-4' data-aos="fade-right">
          {useUserAuth.getState().username == '' ? (
            <Link to={"/Signup"}><img src='phstore_banner3.webp' className='img-fluid banner-ph'></img></Link>
          ) : (
            <Link to={"/AddProduct"}><img src='phstore_banner3.webp' className='img-fluid banner-ph'></img></Link>
          )}
        </div>
      </div>
    </div>
  );

}

export default App;
