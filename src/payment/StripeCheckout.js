// Payment gateway alternative
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { clearTheCart, loadCart } from "../core/helper/carthelper";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { createOrder } from "../core/helper/orderhelper";

export default function StripeCheckout({
  products,
  setReload = (f) => f,
  reload = undefined,
}) {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  // save only if available
  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._Id;

  const getTotalPrice = () => {
    let amount = 0;
    products.map((product) => {
      amount += product.price;
    });
    return amount;
  };

  const makePayment = (token) => {
    const body = {
      token,
      products,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    return fetch(`${API}/stripepayment`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        clearTheCart();
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_51HkVQxEuru1ymb4kembxL3tUNZCwmTsaJjJDTCqfCfCEL6pEK6Q6htFw0dDpMsLbQ7e6WH8Imt9HNLDvcEXz88eC00XGKJtCwd"
        token={makePayment}
        amount={getTotalPrice() * 100} // *100 because stripe charges in cents
        name="Checkout my cart"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-block btn-success">Pay with Stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Sign In</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe</h3>
      {showStripeButton()}
    </div>
  );
}
