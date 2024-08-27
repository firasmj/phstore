import React from "react";
import '../App.css';
import '../css1.css';
import Aos from 'aos';
import 'aos/dist/aos.css'
import { useEffect } from 'react';
import Image from 'react-bootstrap/Image';


function Foryou() {
    useEffect(() => {
        Aos.init({ duration: 1000 });
    }, []);
    return (
        <div>
            <div class="welcome" data-aos="fade-up">
                <h2>Gifts for you</h2>
                <hr style={{ width: "50%", marginLeft: "25%" }} />
                <h3>ملحقات تصميم</h3>
                <hr style={{ border: "0" }} /> <hr style={{ border: "0" }} />
                <div className="drimg1">
                    <Image src="../dr1.jpg" fluid rounded className="drrrr" data-aos="fade-up" />
                    <p className="fylink" data-aos="fade-up"><a href="https://drive.google.com/folderview?id=1WeKULApZBtkMsZeLAcSx4l2mb82x0t8f">Drive Pack 1</a></p>
                    <p className="fylink" data-aos="fade-up"><a href="https://drive.google.com/folderview?id=1JwNQho1mx6QwVI6ano65b3f0geOL2Zy4">Drive Pack 2</a></p>
                </div>
            </div>
        </div>
    );
}

export default Foryou;