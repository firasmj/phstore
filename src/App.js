
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
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6
    },
    desktop: {
      breakpoint: { max: 3000, min: 1050 },
      items: 5
    },
    tablet: {
      breakpoint: { max: 1050, min: 640 },
      items: 3
    },
    tabletsmall: {
      breakpoint: { max: 640, min: 400 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 400, min: 0 },
      items: 2
    }
  };

  const [products, setProducts] = useState([]);
  const [mobilesElectronics, setMobilesElectronics] = useState([]);
  const [fashion, setFashion] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [usernames2, setUsernames2] = useState([]);

  const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  });

  useEffect(() => {
    axiosInstance.get('/usernames')
      .then(response => setUsernames2(response.data))
      // .then(response => console.log(response.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axiosInstance.get('/products/latest')
    .then(response => setProducts(response.data))
    // .then(response => console.log(response.data))
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    axiosInstance.get('/api/productsMobilesElectronics')
    .then(response => setMobilesElectronics(response.data))
    // .then(response => console.log(response.data))
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    axiosInstance.get('/api/productsFashion')
    .then(response => setFashion(response.data))
    // .then(response => console.log(response.data))
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    Aos.init({ duration: 2000 });
  }, []);
  return (
    <div>
    <div className='cont1'>
      <div className='containerhz1' style={{background:'none', padding: '0', margin: '0'}}>
        <h1 style={{ paddingBottom: '1.3rem', marginTop: '1.5rem' }} data-aos="fade-up">
        <p style={{ color: '#4660e1' }}> Welcome {useUserAuth.getState().id != null ? (useUserAuth.getState().username) : <></>}</p>
        </h1>
      </div>
      <hr />

      <div className='containerhz1'>
        <h2 style={{ paddingBottom: '1.3rem', marginTop: '1.5rem' }} data-aos="fade-up">
          Latest Products
        </h2>
        <div className="d-flex justify-content-end mx-5">
          <Button className='shadow' style={{backgroundColor: 'rgba(11, 13, 170, 0.697)', border: '0'}}><Link to={`/ProductsPage`} className='text-decoration-none text-white'>See More</Link></Button>
        </div>
        <Carousel
          swipeable={false}
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
          {products.map(product => (
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
          <Button className='shadow' style={{backgroundColor: 'rgba(11, 13, 170, 0.697)', border: '0'}}><Link to={`/ProductsPage`} className='text-decoration-none text-white'>See More</Link></Button>
        </div>
        <Carousel
          swipeable={false}
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
          {mobilesElectronics.map(product => (
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
          <Button className='shadow' style={{backgroundColor: 'rgba(11, 13, 170, 0.697)', border: '0'}}><Link to={`/ProductsPage`} className='text-decoration-none text-white'>See More</Link></Button>
        </div>
        <Carousel
          swipeable={false}
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
          {fashion.map(product => (
            //<p key={user.id}>{user.name}</p>
            ((product.status == "accepted") && (product.visibility == 1) && <ProductCard key={product.id} item={product} />)
          ))}
        </Carousel>
      </div>
        
      <div className='jumbotron jumbotron-fluid mt-4' data-aos="fade-up">
        {useUserAuth.getState().username == '' ? (
        <Link to={"/Signup"}><img src='phstore_banner6.webp' className='img-fluid'></img></Link>
      ): (
        <Link to={"/AddProduct"}><img src='phstore_banner6.webp' className='img-fluid'></img></Link>
      )}
      </div>
    </div>
    </div>
  );

}

export default App;
