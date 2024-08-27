import React, { useState } from "react";
import CryptAPI from '@cryptapi/api';

const CryptoPayment = ({ item }) => {
    var price = item.price;
    const [coin, setCoin] = useState("");
    const [addy2, setAddy2] = useState("");

    const createPayment = async (e) => {
        e.preventDefault();
        // coin = form1.coin1.value;
        var myAddress = "bc1qu0fv3lg62zeer8l9cjgkmpmtv9fxtnpc68xh82";
        var callbackUrl = "https://clean-breads-sleep.loca.lt";
        var params = { id: item.id };
        // var cryptapiParams;
        const ca = new CryptAPI(coin, myAddress, callbackUrl, params);
        setAddy2(await ca.getAddress().catch(err => console.log(err)));
        console.log(addy2);
        const data = await ca.checkLogs();
        console.log(data);
    }

    const handleChange = (e) => {
        setCoin(e.target.value);
    }

    return (
        <div>
            <form name="form1" onSubmit={createPayment}>
                <hr />
                <label>choose coin</label>
                <select name="coin1" onChange={handleChange}>
                    <option selected>Select coin</option>
                    <option value={"btc"}>Bitcoin BTC</option>
                    <option value={"usdt"}>USDT</option>
                    <option value={"ltc"}>Litecoin LTC</option>
                </select>
                <br />
                <p>Name: {item.name} <br /> Price: {price}</p>
                <input type="submit" value="submit" />
            </form>
            {addy2 !== "" && <p>{coin} address: {addy2}</p>}
        </div>
    )
}

export default CryptoPayment;