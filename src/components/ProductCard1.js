import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { CbChecks } from "./CbChecks";



function ProductCard1({ item }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);


  const [price, setPrice] = useState(0);

  const changePrice = () => {
    var i = document.getElementById('inumber').value;
    i *= (parseInt(item.price));
    setPrice(i);
  }

  const [showPay, setShowPay] = useState(false);

  function orderw1() {


    var q1 = document.getElementById('inumber').value;
    var s = "https://wa.me/96181089213?text=Hello%2C%20I%20want%20to%20order%20" + q1 + "%20" + (item.name) + "%20Accounts%21";
    document.getElementById('w11').setAttribute("href", s);
    if (showPay) {
      document.getElementById('coinbasebtn').setAttribute('href', CbChecks[price - 1]);
    }
  }

  function verify1() {
    var i1 = document.getElementById('iemail');
    var i2 = document.getElementById('iemailconf');
    var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if ((i1.value !== i2.value) || (reg.test(i2.value) == false)) {
      alert("The Emails don't match / wrong email format");
      setShowPay(false);
    } else {
      setShowPay(true);
    }

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
        </div>

        <div>
          <span>{item.type}</span>
          <h3>{item.name}</h3>
        </div>
      </div>
      <Modal className="modal1" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{item.name} <br />{item.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{item.details}</p>
          <p>{item.price}</p>
          <table>
            <tr>
              <td><label>Enter Amount: </label><input id="inumber" type="number" onKeyUp={changePrice}></input> </td>
              <td><input className="iprice" value={price + "$"} disabled></input></td>
            </tr>
            <br />
            <tr>
              <td><label>Enter Your Email: </label><input id="iemail" type="email" required></input></td>
            </tr>
            <tr>
              <td><label>Confirm Your Email: </label><input id="iemailconf" type="email" onBlur={verify1}></input></td>
            </tr>
            <tr>
              {showPay && <td><input type="button" id="verbtn" onClick={orderw1} value={`Create Payment Link`}></input></td>}
            </tr>
          </table>
          <br /> <br />
          <i src="cart.png" color="white"></i>
          {showPay && <div className="paybtns">
            <a className="bttn1" id="coinbasebtn">Coinbase</a>
            <a className="bttn1" id="w11">Whatsapp</a>
          </div>}
        </Modal.Body>

      </Modal>

    </div>

  );
}

export default ProductCard1;