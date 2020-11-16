import React, { useEffect, useState } from "react";
import Card from "./Card";
import "../styles.css";
import Base from "./Base";
import { loadCart } from "./helper/carthelper";
import StripeCheckout from "../payment/StripeCheckout";
import BraintreeCheckout from "../payment/BraintreeCheckout";

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setProducts(loadCart());
  }, [reload]);

  const loadAllProducts = (products) => {
    return (
      <div>
        <h2>load products</h2>
        {products.map((product, index) => (
          <Card
            key={index}
            product={product}
            addToCart={false}
            removeFromCart={true}
            setReload={setReload}
            reload={reload}
          />
        ))}
      </div>
    );
  };

  const loadCheckout = () => {
    return (
      <div>
        <StripeCheckout
          products={products}
          setReload={setReload}
          reload={reload}
        />
        <BraintreeCheckout
          products={products}
          setReload={setReload}
          reload={reload}
        />
      </div>
    );
  };

  return (
    <Base title="Cart Page" description="Ready to checkout">
      <div className="row text-center">
        <div className="col-6">
          {products.length > 0 ? (
            loadAllProducts(products)
          ) : (
            <h3>No products in cart</h3>
          )}
        </div>
        <div className="col-6">{loadCheckout()}</div>
      </div>
    </Base>
  );
}
