import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import UserContext from "./UserContext";
import Aos from 'aos';
import 'aos/dist/aos.css';
import { useAdminAuth } from "../store";


function AdminSignup() {

    useEffect(() => {
        Aos.init({ duration: 1500 });
    }, []);

    const navigate = useNavigate();

    const ax1 = axios.create({
        baseURL: `http://localhost:3300/`,
    });

    const [isLoading, setIsLoading] = useState(false);

    const [validated1, setValidated1] = useState(false);

    const [data, setData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };
        // Example validation: Email format
        // Example validation: Name is required
        if (!data.password.trim()) {
            newErrors.password = 'Password is required';
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
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await ax1.post('/api/adminLogin', {
                    username: data.username,
                    password: data.password
                });
                if (response.status === 200) {
                    console.log('Login successful');
                    setValidated1(true);
                    var res1 = response.data[0];
                    setData(response.data);
                    useAdminAuth.setState(response.data);
                    navigate('/adminPage');

                } else if (response.status === 204) {
                    console.log('No data returned.');
                    setValidated1(false);
                } else {
                    setValidated1(false);
                }
                console.log(response)
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
            console.log('Form submitted:', data);

        }
    };

    if (isLoading) {
        return <p>Loading...</p>;

    }

    const handleChange = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };

    return (
        <div className="auth-wrapper" data-aos="fade-up">
            <div className="auth-inner">
                <div className="">
                    <form name="form1" onSubmit={handleSubmit}>
                        <h3>Sign In</h3>
                        <div className="mb-3">
                            <label>Username</label>
                            <input name="email" onChange={handleChange('username')} type="username" className="form-control" placeholder="Enter username" />
                            {errors.username && <p className="error">{errors.username}</p>}
                        </div>
                        <div className="mb-3">
                            <label>Password</label>
                            <input name="password" onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter Password" />
                            {errors.password && <p className="error">{errors.password}</p>}
                        </div>
                        {/* <div className="mb-3">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="customCheck1"
                                />
                                <label className="custom-control-label" htmlFor="customCheck1">
                                    Remember me
                                </label>
                            </div>
                        </div> */}
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                        <p className="forgot-password text-right"><a href="#">forgot password?</a></p>
                        <p>{validated1 ? "Logged In Successfully!" : "Something went wrong."}</p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminSignup;