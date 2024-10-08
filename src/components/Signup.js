import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { Link } from "react-router-dom";
import { useUserAuth } from '../store';
import { MDBSpinner } from 'mdb-react-ui-kit';
import '../css1.css';


function Signup() {

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);

  const navigate = useNavigate();

  const [formSent, setFormSent] = useState(false);

  const ax1 = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
  });

  const [isLoading, setIsLoading] = useState(false);

  const userId = useUserAuth((state) => state.id);

  const [userData, setUserData] = useState({
    id: null,
    username: '',
    email: '',
    password: '',
    registered: ''
  });

  const [validated1, setValidated1] = useState(false);

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&_^])[A-Za-z\d@.#$!%*?&_]{8,15}$/;
    if (!passwordRegex.test(data.password)) {
      newErrors.password = 'Password is required, should be between 8 to 15 characters and have special and capital characters.';
      isValid = false;
    } else {
      newErrors.password = '';
    }
    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (userData.id != null) {
      // console.log("userData: " + JSON.stringify(userData));
      useUserAuth.setState(userData);
      localStorage.setItem('userAuthState', JSON.stringify(userData));
    }
  }, [userData]);

  useEffect(() => {
    if (useUserAuth.getState().id != null) {
      // console.log("useUserAuth: " + JSON.stringify(useUserAuth.getState()));
      navigate('/');
    }
  }, [useUserAuth.getState()]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSent(false);
    setValidated1(false);
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await ax1.post('/api/login', {
          email: data.email,
          password: data.password
        });
        if (response.status === 200) {
          // Handle successful response
          console.log('Login successful');
          setValidated1(true);
          setFormSent(true);
          setUserData(response.data);

        } else if (response.status === 204) {
          // Handle case where there's no data
          setFormSent(true);
          console.log('No data returned.');
          setValidated1(false);
        } else {
          setValidated1(false);
          setFormSent(true);
        }
        console.log(response)
      } catch (err) {
        console.log(err);
      } finally {
        setErrors({
          email: '',
          password: '',
        });
        setData({
          email: '',
          password: '',
        });
        setIsLoading(false); // Set loading to false after request completes
      }
      setFormSent(true);
      console.log('Form submitted:', data);

    }
  };

  const guestLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormSent(false);
    try {
      const response = await ax1.post('/api/login', {
        email: "guest@gmail.com",
        password: "Guest23$$"
      });
      if (!response.status == 200) {
        setFormSent(true);
        console.log('No data returned.');
      } else {
        // var dataa = response.data;
        setFormSent(true);
        setUserData(response.data);
        // setUserData(dataa);
        // useUserAuth.setState(dataa);
        // localStorage.setItem('userAuthState', JSON.stringify(dataa));
        // setIsLoading(false);
        // navigate('/');
      }
    } catch (err) {
      console.log(err);
    }
    setFormSent(true);
    setIsLoading(false);
  }


  // if (isLoading) {
  //   return <p>Loading...</p>;

  // }

  const handleChange = (field) => (e) => {
    setData({ ...data, [field]: e.target.value });
  };



  return (
    <div className="auth-wrapper pt-5" data-aos="fade-up">
      {isLoading && <div className='spinner-fm-back'>
        <MDBSpinner className='m-5 spinner-fm' size="lg" role='status' color='light'>
          <span className='visually-hidden'>Loading...</span>
        </MDBSpinner>
      </div>}
      <div className="auth-inner">
        <div className="">
          <h3>Sign In</h3>
          <div className="d-flex justify-content-end"><button onClick={guestLogin} className="btn btn-outline-primary">Login as guest</button></div>
          <form name="form1" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email Address</label>
              <input name="email" onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter Email" />
              {errors.email != null && <p className="error">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input name="password" onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter Password" />
              {errors.password != null && <p className="error">{errors.password}</p>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
            <p className="forgot-password text-right"><a href="#">forgot password?</a></p>
            <Link to={"/Register"}><p className="forgot-password text-right">Don't have an account? Register</p></Link>
            <p>{formSent ? (validated1 ? "Logged In Successfully!" : "Something went wrong.") : " "}</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup;