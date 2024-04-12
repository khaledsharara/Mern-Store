const users = require("../models/users");

class PaymobIntegration {
  apiKey = process.env.PAYMOB_API_KEY;
  apiUrl = "https://accept.paymob.com/api";


  // async payWithToken(paymobToken) {
  //   try {
  //     const response = await fetch(`${this.apiUrl}/acceptance/payments/pay`, {
  //       method: "POST",
  //       headers: {
  //         accept: "application/json",
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         token: paymobToken,
  //       }),
  //     });

  //     const data = await response.json();

  //     console.log("Pay with token", data);

  //     if (!response.ok) {
  //       throw new Error(`Payment failed: ${data.message}`);
  //     }

  //     return data;
  //   } catch (error) {
  //     console.error("Payment failed", error);
  //     throw error;
  //   }
  // }

  async authenticate() {
    try {
      console.log("authenticating");
      const response = await fetch(`${this.apiUrl}/auth/tokens`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
        }),
      });

      const data = await response.json();

      console.log("Auth", data);

      if (!response.ok) {
        throw new Error(`Authentication failed: ${data.message}`);
      }

      return data.token;
    } catch (error) {
      console.error("Authentication failed", error);
      throw error;
    }
  }

  async registerOrder(authToken, orderData) {
    try {
      const response = await fetch(`${this.apiUrl}/ecommerce/orders`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      console.log("Register order", data);

      if (!response.ok) {
        throw new Error(`Order registration failed: ${data.message}`);
      }

      return data.id;
    } catch (error) {
      console.error("Order registration failed", error);
      throw error;
    }
  }

  async requestPaymentKey(authToken, paymentData) {
    try {
      const response = await fetch(`${this.apiUrl}/acceptance/payment_keys`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      console.log("Req payment key", data);

      if (!response.ok) {
        throw new Error(`Payment key request failed: ${data.message}`);
      }

      return data.token;

      // pay with token here
      // const paymobToken = data.token;
      // const paymentWithTokenResponse = payWithToken(paymobToken);

      // return paymentWithTokenResponse;

    } catch (error) {
      console.error("Payment key request failed", error);
      throw error;
    }
  }

  async findUserEmail(req, res) {
    let { uId } = req.body;
    try {
      let userEmail = await users.findById(uId);
      return res.json({ userEmail });
    } catch (error) {
      console.log("cant find user");
      throw error;
    }
  }
}

const paymobController = new PaymobIntegration();
module.exports = paymobController;
