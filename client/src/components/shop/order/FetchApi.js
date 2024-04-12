import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
const apiURL = process.env.REACT_APP_API_URL;

export const getBrainTreeToken = async () => {
  let uId = JSON.parse(localStorage.getItem("jwt")).user._id;
  try {
    let res = await axios.post(`${apiURL}/api/braintree/get-token`, {
      uId: uId,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPaymentProcess = async (paymentData) => {
  try {
    let res = await axios.post(`${apiURL}/api/braintree/payment`, paymentData);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createOrder = async (orderData) => {
  try {
    console.log("in order API");
    let res = await axios.post(`${apiURL}/api/order/create-order`, orderData);
    return res.data;
  } catch (error) {
    console.log("error in api");
    console.log(error);
  }
};

export const uploadPaymentTransfer = async (paymentImage) => {
  const fileName = `${Date.now()}-${paymentImage.name}`;
  const uploadTask = await firebase
    .storage()
    .ref(`payment/${fileName}`)
    .put(paymentImage);
  const downloadURL = await uploadTask.ref.getDownloadURL();
  return downloadURL;
};

export const getAllCoupons = async () => {
  try {
    const response = await axios.get(`${apiURL}/api/coupons/get-all-coupons`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const authenticatePaymob = async () => {
  try {
    const res = await axios.post(`${apiURL}/api/paymob/authenticate`);
    console.log("authtoken", res.data.authToken);
    return res.data.authToken;
  } catch (error) {
    console.error("Paymob Authentication failed", error);
    throw error;
  }
};

export const registerPaymobOrder = async (authToken, orderData) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/paymob/register-order`,
      orderData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data.orderId;
  } catch (error) {
    console.error("Paymob Order registration failed", error);
    throw error;
  }
};

export const requestPaymobPaymentKey = async (authToken, paymentData) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/paymob/request-payment-key`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return res.data.paymentKey;
  } catch (error) {
    console.error("Paymob Payment key request failed", error);
    throw error;
  }
};

export const findUserEmail = async (userId) => {
  try {
    const res = await axios.post(`${apiURL}/api/paymob/find-user-email`, {
      uId: userId,
    });
    return res.data.userEmail.email;
  } catch (error) {
    console.error("User email retrieval failed", error);
    throw error;
  }
};
