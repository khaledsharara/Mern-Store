const express = require("express");
const router = express.Router();
const paymobController = require("../controller/paymob");

router.post("/authenticate", async (req, res) => {
  try {
    const authToken = await paymobController.authenticate();
    res.json({ authToken });
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
});

router.post("/register-order", async (req, res) => {
  const orderData = req.body;
  try {
    const authToken = await paymobController.authenticate();
    const orderId = await paymobController.registerOrder(authToken, orderData);
    res.json({ orderId });
  } catch (error) {
    res.status(500).json({ error: "Order registration failed" });
  }
});

router.post("/request-payment-key", async (req, res) => {
  const paymentData = req.body;
  try {
    const authToken = await paymobController.authenticate();
    const paymentKey = await paymobController.requestPaymentKey(
      authToken,
      paymentData
    );
    res.json({ paymentKey });
  } catch (error) {
    res.status(500).json({ error: "Payment key request failed" });
  }
});

router.post("/find-user-email", paymobController.findUserEmail);

module.exports = router;
