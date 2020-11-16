import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { clearTheCart, loadCart } from "../core/helper/carthelper";
import { getPaymentToken, processPayment } from "../payment/paymenthelper";
import { createOrder } from "../core/helper/orderhelper";
import DropIn from "braintree-web-drop-in-react";
import { isAuthenticated } from "../auth/helper";

export default function BraintreeCheckout({
  products,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}, // automatically get filled
  });

  // save only if available
  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getToken = (userId, token) => {
    getPaymentToken(userId, token)
      .then((info) => {
        if (info.error) {
          setInfo({ ...info, error: info.error });
        } else {
          const clientToken = info.clientToken;
          setInfo({ clientToken });
        }
      })
      .catch((err) => console.log(err));
  };

  const showBraintreeDropIn = () => (
    <div>
      {info.clientToken !== null && products.length > 0 ? (
        <div>
          <DropIn
            options={{ authorization: info.clientToken }}
            onInstance={(instance) => (info.instance = instance)}
          />
          <button className="btn btn-block btn-success" onClick={onPurchase}>
            Buy
          </button>
        </div>
      ) : (
        <h3>Please login or add something to cart</h3>
      )}
    </div>
  );

  useEffect(() => {
    getToken(userId, token);
  }, []);

  const getAmount = () => {
    let amount = 0;
    products.map((product) => {
      amount += product.price;
    });
    return amount;
  };

  const onPurchase = () => {
    setInfo({ loading: true });
    let nonce;
    let getNonce = info.instance
      .requestPaymentMethod()
      .then((data) => {
        nonce = data.nonce;
        const paymentData = {
          paymentMethodNonce: nonce,
          amount: getAmount(),
        };
        processPayment(userId, token, paymentData)
          .then((response) => {
            setInfo({ ...info, success: response.success, loading: false });
            const orderData = {
              products: products,
              transaction_id: response.transaction.id,
              amount: response.transaction.amount,
            };
            createOrder(userId, token, orderData);
            clearTheCart(() => {});
            setReload(!reload);
          })
          .catch((err) => {
            setInfo({ loading: false, success: false });
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <h3>Make payment of {getAmount()}$ using Braintree</h3>
      {showBraintreeDropIn()}
    </div>
  );
}
