// FlutterwaveDemo.js
import React from "react";

const FlutterwaveDemo = () => {
  const handlePayment = () => {
    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxx-X", // Replace with your public key
      tx_ref: "TX-" + Date.now(),
      amount: 100,
      currency: "NGN",
      payment_options: "card, ussd",
      customer: {
        email: "test@example.com",
        phone_number: "08012345678",
        name: "Test User",
      },
      callback: function (response) {
        console.log("Payment callback:", response);
        alert("Payment complete! Tx Ref: " + response.tx_ref);
      },
      customizations: {
        title: "Test React Pay",
        description: "Payment for test product",
        logo: "https://via.placeholder.com/150",
      },
    });
  };

  return (
    <div>
      <h2>Pay with Flutterwave</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default FlutterwaveDemo;
