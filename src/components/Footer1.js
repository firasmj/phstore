import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram, faWhatsapp, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import '../css1.css';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer1() {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);


    return (
        <div>
            <footer>
                <div className="footer" data-aos="fade-up">
                    <div className="row">
                        <a href="https://www.instagram.com/firas_mj"><i><FontAwesomeIcon icon={faInstagram} /></i></a>
                        <a href="https://wa.me/96181089213"><i><FontAwesomeIcon icon={faWhatsapp} /></i></a>
                        <a href="#"><i><FontAwesomeIcon icon={faFacebook} /></i></a>
                        <a href="#"><i><FontAwesomeIcon icon={faXTwitter} /></i></a>
                    </div>

                    <div className="row">
                        <ul>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">Our Services</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Career</a></li>
                            <li><Link className="nav-link" to="/AdminSignup">Admin Signup</Link></li>
                        </ul>
                    </div>

                    <div className="row">
                        <p style={{ textAlign: "center" }}>PH Store Copyright © 2024 PH - All rights reserved </p>
                        <p style={{ textAlign: "center" }}>Developed By Firas Majzoub</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer1;