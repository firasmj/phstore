import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import CryptoPayment from "./CrytoPayment";
import { Button } from "react-bootstrap";



function UserCard({ item }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const [payPressed, setPayPressed] = useState(false);


  const [showPay, setShowPay] = useState(true);
  var s = "https://wa.me/96181089213?text=Hello%2C%20I%20want%20to%20order%20the%20" + (item.name) + "%20" + (item.type) + "%20username%21";


  const cryptpay = () => {
    // var coin1 = "bitcoin";
    // var address1 = "abcd";
    // var callbackUrl = "/";
    // var params = 22;
    // var cryptapiParams;
    setPayPressed(true);
  }


  return (
    <div className="mainmovie">
      <div className="movie" onClick={handleShow}>
        <div>
          <p>{item.price}</p>
        </div>

        <div>
          {item.type === "Instagram" ? (
            <img src="../instagram1.png" alt={item.name} />
          ) : item.type === "Tiktok" ? (
            <img src="../tiktok1.png" alt={item.name} />
          ) : null}
          {/* <img src={item.image} alt={item.name}></img> */}
        </div>

        <div>
          <span>{item.type}</span>
          <h3>{item.name}</h3>
        </div>
      </div>
      {/* <Popup1 showModal={showModal}/> */}
      <Modal className="custom-modal-1" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name} <br />{item.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{item.details}</p>
          <p>Price: {item.price}</p>
          <table>
            {/* <tr>
          <td><label>Enter Amount: </label><input id="inumber"  type="number" onKeyUp={changePrice}></input> </td>
          <td><input className="iprice" value={price + "$"} disabled></input></td>
        </tr> */}
            <br />
            {/* <tr>
          <td><label>Enter Your Email: </label><input id="iemail" type="email" required></input></td>
        </tr>
        <tr>
          <td><label>Confirm Your Email: </label><input id="iemailconf" type="email" ></input></td>
        </tr> */}
            {/* <tr>
          {showPay && <td><input type="button" id="verbtn" onClick={orderw1} value={`Create Payment Link`}></input></td>}
        </tr> */}
          </table>
          <br /> <br />
          <i src="cart.png" color="white"></i>
          {/* {showPay && <div className="paybtns">
            <input type="button" onClick={cryptpay} value="crypto" />
            <a className="bttn1" id="coinbasebtn" onClick={cryptpay}>Coinbase</a>
            <a className="bttn1" id="w11" href={s}>Whatsapp</a>
            {payPressed && <CryptoPayment item={item} />}
          </div>} */}
          {showPay && <div className="paybtns">
            <Button onClick={cryptpay} className="mx-2">crypto</Button>
            {/* <input type="button" onClick={cryptpay} value="crypto" /> */}
            <Button href={s} className="mx-2">Whatsapp</Button>
            {/* <a className="bttn1" id="coinbasebtn" onClick={cryptpay}>Coinbase</a>
            <a className="bttn1" id="w11" href={s}>Whatsapp</a> */}
            {payPressed && <CryptoPayment item={item} />}

            {/* <button className="bttn1" id="whatsapp"><a id="w11">Whatsapp</a></button> */}
          </div>}
        </Modal.Body>

      </Modal>

    </div>

  );
}

export default UserCard;