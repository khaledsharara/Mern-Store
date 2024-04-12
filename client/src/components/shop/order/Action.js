import {
  createOrder,
  uploadPaymentTransfer,
  getAllCoupons,
  authenticatePaymob,
  registerPaymobOrder,
  requestPaymobPaymentKey,
  findUserEmail,
} from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { subTotal, totalCost } from "../partials/Mixins";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const generateTransactionId = (type) => {
  let prefix;
  // Basic structure of transaction ID depending on payment method
  switch (type) {
    case "COD":
      prefix = "COD";
      break;
    case "fawry":
      prefix = "FWY";
      break;
    case "instapay":
      prefix = "INS";
      break;
    case "telda":
      prefix = "TLD";
      break;
    case "paymob":
      prefix = "ONL";
      break;
    default:
      prefix = "ORD";
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);

  return `${prefix}-${timestamp}-${randomPart}`.toUpperCase().substring(0, 12);
};

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchbrainTree = async (getBrainTreeToken, setState) => {
  try {
    let responseData = await getBrainTreeToken();
    if (responseData && responseData) {
      setState({
        clientToken: responseData.clientToken,
        success: responseData.success,
      });
      console.log(responseData);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  type,
  data,
  dispatch,
  state,
  setState,
  getPaymentProcess,
  finalCost,
  history
) => {
  console.log(state);

  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else if (
    !JSON.parse(localStorage.getItem("jwt"))?.user?._id &&
    !state.name
  ) {
    setState({ ...state, error: "Please provide your name" });
  } else if (
    !JSON.parse(localStorage.getItem("jwt"))?.user?._id &&
    !state.email
  ) {
    setState({ ...state, error: "Please provide your email" });
  } else {
    if (type === "online") {
      console.log("online found");
      let nonce;
      state.instance
        .requestPaymentMethod()
        .then((data) => {
          dispatch({ type: "loading", payload: true });
          nonce = data.nonce;
          let paymentData = {
            amountTotal: finalCost,
            paymentMethod: nonce,
          };
          getPaymentProcess(paymentData)
            .then(async (res) => {
              if (res) {
                let orderData = {
                  allProduct: JSON.parse(localStorage.getItem("cart")),
                  user:
                    JSON.parse(localStorage.getItem("jwt"))?.user?._id || null,
                  amount: res.transaction.amount,
                  transactionId: res.transaction.id,
                  address: state.address,
                  phone: state.phone,
                  guestInfo: {
                    name: state.name ? state.name : null,
                    email: state.email ? state.email : null,
                  },
                };
                try {
                  let resposeData = await createOrder(orderData);
                  if (resposeData.success) {
                    localStorage.setItem("cart", JSON.stringify([]));
                    dispatch({ type: "cartProduct", payload: null });
                    dispatch({ type: "cartTotalCost", payload: null });
                    dispatch({ type: "orderSuccess", payload: true });
                    setState({ clientToken: "", instance: {} });
                    dispatch({ type: "loading", payload: false });
                    return history.push("/");
                  } else if (resposeData.error) {
                    console.log(resposeData.error);
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((error) => {
          console.log(error);
          setState({ ...state, error: error.message });
        });
    } else if (type === "COD") {
      // Process the order without payment for Cash on Delivery (COD)
      console.log("COD found");
      const transactionId = generateTransactionId(type);

      let orderData = {
        allProduct: JSON.parse(localStorage.getItem("cart")),
        user: JSON.parse(localStorage.getItem("jwt"))?.user?._id || null,
        amount: finalCost,
        transactionId: transactionId,
        address: state.address,
        phone: state.phone,
        guestInfo: {
          name: state.name ? state.name : null,
          email: state.email ? state.email : null,
        },
        paymentMethod: type,
        paymentSS: null,
      };
      console.log("Order data: ", orderData);
      try {
        console.log("attempting order");
        let resposeData = await createOrder(orderData);
        if (resposeData.success) {
          console.log("success");
          localStorage.setItem("cart", JSON.stringify([]));
          dispatch({ type: "cartProduct", payload: null });
          dispatch({ type: "cartTotalCost", payload: null });
          // dispatch({ type: "orderSuccess", payload: true });
          dispatch({ type: "loading", payload: false });
          let redirectURL = `/order/${transactionId}`;
          console.log("redirect", redirectURL);
          return history.push(redirectURL);
        } else if (resposeData.error) {
          console.log(resposeData.error);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (type === "Transfer") {
      console.log("Transfer found");
      let transferSS = await uploadPaymentTransfer(state.transferSS);

      const transactionId = generateTransactionId(state.paymentMethod);

      let orderData = {
        allProduct: JSON.parse(localStorage.getItem("cart")),
        user: JSON.parse(localStorage.getItem("jwt"))?.user?._id || null,
        amount: finalCost,
        transactionId: transactionId,
        address: state.address,
        phone: state.phone,
        guestInfo: {
          name: state.name ? state.name : null,
          email: state.email ? state.email : null,
        },
        paymentMethod: state.paymentMethod,
        transferSS: transferSS,
      };
      console.log("Order data: ", orderData);
      try {
        console.log("attempting order");
        let resposeData = await createOrder(orderData);
        if (resposeData.success) {
          console.log("success");
          localStorage.setItem("cart", JSON.stringify([]));
          dispatch({ type: "cartProduct", payload: null });
          dispatch({ type: "cartTotalCost", payload: null });
          // dispatch({ type: "orderSuccess", payload: true });
          dispatch({ type: "loading", payload: false });
          let redirectURL = `/order/${transactionId}`;
          console.log("redirect", redirectURL);
          return history.push(redirectURL);
        } else if (resposeData.error) {
          console.log(resposeData.error);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (type === "Paymob") {
      const transformedItems = [];
      const itemVariations = {};
      JSON.parse(localStorage.getItem("cart")).forEach((item) => {
        // Create a new object with the desired keys and values
        const transformedItem = {
          name: item.id,
          amount_cents: item.price * 100,
          description: Number(item.totalAvailableQuantity),
          quantity: Number(item.quantitiy),
        };
        console.log("item var", item.variations);

        itemVariations[item.id] = item.variations || null;

        // Push the transformed item to the array
        transformedItems.push(transformedItem);
      });

      // console.log("transformedItems", transformedItems);

      try {
        const transactionId = generateTransactionId("paymob");
        const paymobAuthToken = await authenticatePaymob();
        const paymobOrderData = {
          auth_token: paymobAuthToken,
          delivery_needed: "false",
          amount_cents: finalCost * 100,
          currency: "EGP",
          merchant_order_id: transactionId,
          items: transformedItems,
        };

        const paymobOrderId = await registerPaymobOrder(
          paymobAuthToken,
          paymobOrderData
        );

        const userEmail = state.email
          ? state.email
          : await findUserEmail(
              JSON.parse(localStorage.getItem("jwt")).user._id
            );

        const paymobPaymentData = {
          auth_token: paymobAuthToken,
          amount_cents: finalCost * 100,
          expiration: 600,
          order_id: paymobOrderId,
          billing_data: {
            apartment: "803",
            email: userEmail,
            floor: "NA",
            first_name: JSON.parse(localStorage.getItem("jwt"))?.user?._id
              ? JSON.parse(localStorage.getItem("jwt")).user._id
              : state.name,
            street: state.address,
            building: "NA",
            phone_number: state.phone,
            shipping_method: "NA",
            postal_code: "NA",
            city: "NA",
            country: "NA",
            last_name: JSON.parse(localStorage.getItem("jwt"))?.user?._id
              ? "user"
              : "guest",
            state: "NA",
            extra_description: JSON.stringify(itemVariations),
          },
          currency: "EGP",
          integration_id: 4449305,
        };

        console.log(paymobPaymentData.billing_data);
        const paymobPaymentKey = await requestPaymobPaymentKey(
          paymobAuthToken,
          paymobPaymentData
        );
        console.log("Paymob Payment Key:", paymobPaymentKey);

        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        // dispatch({ type: "orderSuccess", payload: true });
        dispatch({ type: "loading", payload: false });

        window.location.href = `https://accept.paymob.com/api/acceptance/iframes/820176?payment_token=${paymobPaymentKey}`;
      } catch (error) {
        console.error("Paymob Payment failed", error);
        setState({ ...state, error: "Paymob Payment failed" });
      }
    }
  }
};

const compareCartandAllowed = (cartList, allowedProducts) => {
  const allowedItems = cartList.filter((item) =>
    allowedProducts.includes(item._id)
  );
  return allowedItems;
};

export const applyCoupon = async (
  coupon,
  setCostBeforeShipping,
  setAlert,
  currentCoupon,
  setCurrentCoupon
) => {
  const response = await cartListProduct();
  const cartList = response.Products;

  try {
    let responseData = await getAllCoupons();
    if (responseData && responseData.coupons && currentCoupon === null) {
      let couponData = responseData.coupons.find(
        (item) => item.Code === coupon
      );
      if (couponData) {
        let allowedProducts = await compareCartandAllowed(
          cartList,
          couponData.allowedProducts
        );
        let allowedProductsCost = 0;
        allowedProducts.forEach((item) => {
          allowedProductsCost += subTotal(item._id, item.pPrice);
        });
        switch (couponData.type) {
          case "fixed":
            if (allowedProductsCost < couponData.minimumTotal) {
              setAlert(
                `Minimum order total is ${couponData.minimumTotal} 
                EGP`
              );
              return;
            }
            setCostBeforeShipping(totalCost() - couponData.value);
            setCurrentCoupon(couponData);
            break;
          case "percent":
            if (allowedProductsCost < couponData.minimumTotal) {
              setAlert(
                `Minimum order total is ${couponData.minimumTotal} 
                EGP`
              );
              return;
            }
            setCostBeforeShipping(
              parseInt(totalCost() - (totalCost() * couponData.value) / 100)
            );
            setCurrentCoupon(couponData);
            break;
          case "buyGet":
            if (allowedProductsCost < couponData.minimumTotal) {
              setAlert(
                `Minimum order total is ${couponData.minimumTotal} 
                EGP`
              );
              return;
            }
            let allowedProductsQuantity = 0;
            allowedProducts.forEach((item) => {
              allowedProductsQuantity +=
                subTotal(item._id, item.pPrice) / item.pPrice;
            });
            if (
              allowedProductsQuantity >=
              parseInt(couponData.buyGetValue[0]) +
                parseInt(couponData.buyGetValue[1])
            ) {
              //Check how many times the coupon can be applied
              let times = Math.floor(
                allowedProductsQuantity /
                  (couponData.buyGetValue[0] + couponData.buyGetValue[1])
              );
              //arrange allowed products from low to high price
              allowedProducts.sort((a, b) => a.pPrice - b.pPrice);
              let allowedProductsArray = [];
              allowedProducts.forEach((item) => {
                for (
                  let i = 0;
                  i < subTotal(item._id, item.pPrice) / item.pPrice;
                  i++
                ) {
                  allowedProductsArray.push(item._id);
                }
              });

              console.log("allowedProductsArray", allowedProductsArray);

              let cheapestItemsPrice = 0;
              for (let i = 0; i < times * couponData.buyGetValue[1]; i++) {
                cheapestItemsPrice += cartList.find(
                  (item) => item._id === allowedProductsArray[i]
                ).pPrice;
              }
              console.log("cheapestItemsPrice", cheapestItemsPrice);

              setCostBeforeShipping(totalCost() - cheapestItemsPrice);
              setCurrentCoupon(couponData);

              break;
            } else {
              setAlert(
                `Minimum order quantity is 
                ${
                  parseInt(couponData.buyGetValue[0]) +
                  parseInt(couponData.buyGetValue[1])
                }
                  items`
              );
            }
            break;
          case "freeShipping":
            if (allowedProductsCost < couponData.minimumTotal) {
              setAlert(
                `Minimum order total is ${couponData.minimumTotal} 
                  EGP`
              );
              return;
            }
            setCostBeforeShipping(totalCost());
            setCurrentCoupon(couponData);
            break;
        }
      } else {
        setAlert("Invalid Coupon Code");
      }
    } else {
      setAlert("Coupon already used");
    }
  } catch (error) {
    console.log(error);
  }
};
