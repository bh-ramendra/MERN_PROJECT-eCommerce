import React, { useState, useEffect } from "react";
import { isAutheticated } from "../auth/helper";
import { Link } from "react-router-dom";
import StripeCheckoutButton from "react-stripe-checkout";
import { API } from "../backend";
import { cartEmpty, loadCart } from "./helper/carthelper";
import { createOrder } from "./helper/orderhelper";

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: "",
    address: "",
  });

  const token = isAutheticated() && isAutheticated().token;
  const userId = isAutheticated() && isAutheticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.forEach((p) => {
      amount = amount + p.price;
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

        console.log("PAYMENT SUCCESS");
        //call further methods
        const orderData = {
          products: products,
          transaction_id: response.transaction.id,
          amount: response.transaction.amount,
        };
        createOrder(userId, token, orderData);
        cartEmpty(() => {
          console.log("did we crash!");
        });
        setReload(!reload);
        const { status } = response;
        console.log("STATUS", status);
      })
      .catch((error) => {
        console.log("PAYMENT FAILED", error);
      });
  };

  const showStripeButton = () => {
    return isAutheticated() ? (
      <StripeCheckoutButton
        stripeKey="pk_test_"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Tshirts"
      >
        <button className="btn btn-success">Pay with stripe</button>
      </StripeCheckoutButton>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Signin</button>
      </Link>
    );
  };

  return (
    <div>
      <h3 className="text-white">Stripe Checkout {getFinalAmount()}</h3>
      {showStripeButton()}
    </div>
  );
};

export default StripeCheckout;
