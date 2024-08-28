import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { MDBSpinner } from 'mdb-react-ui-kit';
import '../css1.css';

function Register() {

    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, []);

    const navigate = useNavigate();

    const ax1 = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_URL}/`,
    });

    const [isLoading, setIsLoading] = useState(false);

    const [userData, setUserData] = useState({
        id: null,
        username: '',
        email: '',
        password: '',
        registered: ''
    });

    const [validated1, setValidated1] = useState(false);

    const [data, setData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
    });


    const handleChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };

    const validateForm = async () => {
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
        //////////////
        const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
        if (!usernameRegex.test(data.username)) {
            newErrors.username = 'Username should be 3 to 15 characters with only letters, numbers or _';
            isValid = false;
        } else {
            newErrors.username = '';
        }
        try {
            const response = await ax1.get(`/api/checkUsername/${data.username}`);

            if (response.status === 500) {
                isValid = false;
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data1 = await response.data;

            if (!data1.available) {
                isValid = false;
                console.log("username already exists");
                newErrors.username = "username already exists";
            }
        } catch (error) {
            console.error('Error checking username:', error);
            isValid = false;
            throw error; // Re-throw the error for handling at a higher level
        }
        //check email
        try {
            const response = await ax1.get(`/api/checkEmail/${data.email}`);

            if (response.status === 500) {
                isValid = false;
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data2 = await response.data;

            if (!data2.available) {
                isValid = false;
                console.log("email already exists");
                newErrors.email = "email already exists";
            }
        } catch (error) {
            console.error('Error checking email:', error);
            isValid = false;
            throw error; // Re-throw the error for handling at a higher level
        }
        //check if exists in database
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/;
        if (!passwordRegex.test(data.password)) {
            newErrors.password = 'Password is required, should be between 8 to 15 characters and have special and capital characters.';
            isValid = false;
        } else {
            newErrors.password = '';
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidated1(false);
        const valid = await validateForm();
        if (valid) {
            setIsLoading(true);
            try {
                const response = await ax1.post('/api/registerUser', {
                    username: data.username,
                    email: data.email,
                    password: data.password
                });
                if (response.status === 200) {
                    // Handle successful response
                    console.log('Login successful');
                    setValidated1(true);
                    var res1 = response.data[0];
                    setUserData(response.data);
                } else if (response.status === 204) {
                    // Handle case where there's no data
                    console.log('No data returned.');
                    setValidated1(false);
                } else {
                    setValidated1(false);
                }
                console.log(response)
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false); // Set loading to false after request completes
            }
            console.log('Form submitted:', data);

        }
    };

    // if (isLoading) {
    //     return <p>Loading...</p>;

    // }





    return (
        <div className="auth-wrapper" data-aos="fade-up">
            {isLoading && <div className='d-flex justify-content-center spinner-fm'>
                <MDBSpinner className='m-5' role='status' size="lg" color='light'>
                    <span className='visually-hidden'>Loading...</span>
                </MDBSpinner>
            </div>}
            <div className="auth-inner">
                <div className="">
                    <form name="form1" onSubmit={handleSubmit}>
                        <h3>Register a new user</h3>
                        <div className="mb-3">
                            <label>Username</label>
                            <input name="username" onChange={handleChange('username')} type="text" className="form-control" placeholder="Enter Username" />
                            {errors.username != null && <p className="error">{errors.username}</p>}
                        </div>
                        <div className="mb-3">
                            <label>Email Address</label>
                            <input name="email" onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter Email" />
                            {errors.email && <p className="error">{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input name="password" onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter Password" />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        <Link to={"/Signup"}><p className="forgot-password text-right">Already have an account? Login</p></Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register;