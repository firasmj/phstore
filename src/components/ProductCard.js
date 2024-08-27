import React, { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CryptoPayment from "./CrytoPayment";
import axios from "axios";
import { useUserAuth } from "../store";
import { Link } from "react-router-dom";
import "../css1.css";
import { Button } from "react-bootstrap";


function ProductCard({ item }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [payPressed, setPayPressed] = useState(false);
  const [productImages, setProductImages] = useState([]);

  const [showPay, setShowPay] = useState(true);
  var s = "https://wa.me/96181089213?text=Hello%2C%20I%20want%20to%20order%20the%20" + (item.name) + "%20" + (item.type) + "%20username%21";
  const ax1 = axios.create({
    baseURL: `http://localhost:3300`
  });

  useEffect(() => {
    ax1.get(`/getProductImages/${item.id}`)
      .then(response => setProductImages(response.data[0]?.imageUrl))
      // .then(console.log(productImages))
      .catch(err => console.log(err))
  }, []);


  const cryptpay = () => {
    setPayPressed(true);
  }

  // console.log(item.user_id);

  return (
    <div className="mainmovie">
      <div className="movie" onClick={handleShow}>
        <div>
          <p>{item.price}</p>
        </div>

        <div>
          {productImages.length > 0 ? (
            <img src={productImages} alt={item.name}></img>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div>
          <span>{item.type}</span>
          <h3>{item.name}</h3>
        </div>
      </div>
      <Modal className="custom-modal-1" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name} <br/><i>{item.type} product</i></Modal.Title>
        </Modal.Header>
        <Modal.Body className="">
          <p>{item.details}</p>
          <p>Price: {item.price}</p>
          <p style={{textDecoration: 'none'}}>uploaded by: @<Link style={{ color: 'white'}} to={`/Profile/${item.user_id}`}>{item.username}</Link></p>
          <Button><Link to={`/Profile/${item.user_id}`} style={{textDecoration: 'none', color: 'white'}}>Visit {item.username}</Link></Button>
          <table>
            <br />
          </table>
          <br /> <br />
          <i src="cart.png" color="white"></i>
          {showPay && <div className="paybtns">
          </div>}
        </Modal.Body>

      </Modal>

    </div>

  );
}

export default ProductCard;