import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import {
  getBrainTreeToken,
  getPaymentProcess,
  getAllCoupons,
} from "./FetchApi";
import { fetchData, fetchbrainTree, pay, applyCoupon } from "./Action";

import DropIn from "braintree-web-drop-in-react";
import PaymentInstructions from "./PaymentInstructions";

const apiURL = process.env.REACT_APP_API_URL;

export const CheckoutComponent = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
  const [finalCost, setFinalCost] = useState();
  const [address, setAddress] = useState({
    street: "",
    city: "",
    governorate: "",
  });

  const [state, setState] = useState({
    address: "",
    phone: "",
    email: "",
    name: "",
    error: false,
    success: false,
    // client token was previously generated and used for braintree
    // clientToken: "",
    instance: {},
    paymentMethod: null,
    transferSS: null,
  });

  const [showPaymentInstructions, setshowPaymentInstructions] = useState(null);

  useEffect(() => {
    fetchData(cartListProduct, dispatch);
    setFinalCost(totalCost());

    // Client token generation process
    // fetchbrainTree(getBrainTreeToken, setState);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      address.city &&
      address.governorate &&
      address.street &&
      address.city.trim() !== "" &&
      address.governorate.trim() !== "" &&
      address.street.trim() !== ""
    ) {
      setState({
        ...state,
        address: `${address.street},  ${address.city}, ${address.governorate}`,
        error: false,
      });
      console.log(state.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const loginModalOpen = () =>
    data.loginSignupModal
      ? dispatch({ type: "loginSignupModalToggle", payload: false })
      : dispatch({ type: "loginSignupModalToggle", payload: true });

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
        Please wait until finish
      </div>
    );
  }
  return (
    <Fragment>
      <section className="mx-5 mt-20 md:mx-12 md:mt-32 lg:mt-24">
        <div className="text-2xl mx-2">Order</div>
        {/* Product List */}
        <div className="flex flex-col md:flex md:space-x-2 md:flex-row">
          <div className="md:w-1/2">
            <CheckoutProducts
              products={data.cartProduct}
              finalCost={finalCost}
              setFinalCost={setFinalCost}
              address={address}
            />
          </div>
          <div className="w-full order-first md:order-last md:w-5/12">
            <Fragment>
              <div
                onBlur={(e) => setState({ ...state, error: false })}
                className="p-4 md:p-8"
              >
                {state.error ? (
                  <div className="bg-red-200 py-2 px-4 rounded">
                    {state.error}
                  </div>
                ) : (
                  ""
                )}
                {!JSON.parse(localStorage.getItem("jwt"))?.user?._id && (
                  <Fragment>
                    <div className="flex flex-col py-2 mb-2">
                      <label htmlFor="phone" className="pb-2">
                        Name
                      </label>
                      <input
                        value={state.name}
                        onChange={(e) =>
                          setState({
                            ...state,
                            name: e.target.value,
                            error: false,
                          })
                        }
                        type="text"
                        id="name"
                        className="border px-4 py-2"
                        placeholder="Name..."
                      />
                    </div>
                    <div className="flex flex-col py-2 mb-2">
                      <label htmlFor="phone" className="pb-2">
                        Email
                      </label>
                      <input
                        value={state.email}
                        onChange={(e) =>
                          setState({
                            ...state,
                            email: e.target.value,
                            error: false,
                          })
                        }
                        type="email"
                        id="email"
                        className="border px-4 py-2"
                        placeholder="email@email.com"
                      />
                    </div>
                    <div>
                      or{" "}
                      <span
                        onClick={loginModalOpen}
                        className="text-yellow-500 cursor-pointer hover:text-yellow-600"
                      >
                        Login
                      </span>
                    </div>
                    <hr className="my-5" />
                  </Fragment>
                )}
                <h1 className="text-xl pb-3">Delivery information: </h1>
                <div className="flex flex-col py-2">
                  <label htmlFor="address" className="pb-2">
                    Delivery Address
                  </label>
                  <form>
                    <div className="flex py-2 mb-2">
                      <div>
                        <input
                          value={address.street}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              street: e.target.value,
                            })
                          }
                          type="text"
                          id="address"
                          className="border px-4 py-2"
                          placeholder="Address"
                        />
                      </div>
                      <div className="flex justify-end flex-grow">
                        {/* Added flex class to make it a flex container */}
                        <input
                          value={address.city}
                          onChange={(e) =>
                            setAddress({
                              ...address,
                              city: e.target.value,
                            })
                          }
                          type="text"
                          id="address"
                          className="border px-4 py-2"
                          placeholder="City"
                        />
                      </div>
                    </div>
                    <div className="relative flex">
                      <select
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                        value={address.governorate}
                        onChange={(e) => {
                          setAddress({
                            ...address,
                            governorate: e.target.value,
                          });
                        }}
                      >
                        <option value="">Governorate</option>
                        <option value="30">Cairo</option>
                        <option value="40">Giza</option>
                        <option value="50">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="flex flex-col py-2 mb-2">
                  <label htmlFor="phone" className="pb-2">
                    Phone
                  </label>
                  <input
                    value={state.phone}
                    onChange={(e) =>
                      setState({
                        ...state,
                        phone: e.target.value,
                        error: false,
                      })
                    }
                    type="number"
                    id="phone"
                    className="border px-4 py-2"
                    placeholder="+880"
                  />
                </div>
                {/* Old braintree component */}
                {/* <DropIn
                  options={{
                    authorization: state.clientToken,
                    paypal: {
                      flow: "vault",
                    },
                  }}
                  onInstance={(instance) => (state.instance = instance)}
                /> */}
                <div className="mb-5">
                  <ul className="flex flex-col max-w-sm rounded-lg">
                    <li class="inline-flex items-center text-sm font-medium border rounded-t-lg mt-0 last:rounded-b-lg text-center">
                      <div
                        class={`relative flex items-center w-full cursor-pointer px-4 py-1 ${
                          state.paymentMethod === "Paymob"
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={(e) => {
                          setState({
                            ...state,
                            paymentMethod: "Paymob",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-10 h-10 ml-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                          />
                        </svg>

                        <label
                          htmlFor="hs-list-group-item-checkbox-1"
                          class="ms-3.5 block w-full text-sm text-gray-600 dark:text-gray-500 my-3 mr-10 cursor-pointer"
                        >
                          Online Payment
                        </label>
                      </div>
                    </li>
                    <li class="inline-flex items-center text-sm font-medium border text-center">
                      <div
                        class={`relative flex items-center w-full cursor-pointer px-4 py-1 ${
                          state.paymentMethod === "instapay"
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          setState({
                            ...state,
                            paymentMethod: "instapay",
                          })
                        }
                      >
                        <svg
                          width="50"
                          height="40"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <image
                            href="https://firebasestorage.googleapis.com/v0/b/comic-stop.appspot.com/o/assets%2FLogos%2FInstapay.svg?alt=media&token=da6a40a7-20a8-4703-8ddc-9465b0fb4c0b"
                            width="50"
                            height="40"
                            className="my-auto ml-4"
                          />
                        </svg>
                        <label
                          htmlFor="hs-list-group-item-checkbox-1"
                          class="ms-3.5 block w-full text-sm text-gray-600 dark:text-gray-500 my-3 mr-10 cursor-pointer"
                        >
                          Instapay Transfer
                        </label>
                      </div>
                    </li>

                    <li class="inline-flex items-center text-sm font-medium border text-center">
                      <div
                        class={`relative flex items-center w-full cursor-pointer px-4 py-1 ${
                          state.paymentMethod === "telda"
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          setState({
                            ...state,
                            paymentMethod: "telda",
                          })
                        }
                      >
                        <svg
                          width="50"
                          height="40"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <image
                            href="https://firebasestorage.googleapis.com/v0/b/comic-stop.appspot.com/o/assets%2FLogos%2FTelda.svg?alt=media&token=f000e47c-4d84-4fee-ae4c-14498d5f13d7"
                            width="50"
                            height="40"
                            className="my-auto"
                          />
                        </svg>
                        <label
                          htmlFor="hs-list-group-item-checkbox-1"
                          class="ms-3.5 block w-full text-sm text-gray-600 dark:text-gray-500 my-3 mr-6 cursor-pointer"
                        >
                          Telda Transfer
                        </label>
                      </div>
                    </li>

                    <li class="inline-flex items-center text-sm font-medium border rounded-b-lg text-center">
                      <div
                        class={`relative flex items-center w-full cursor-pointer px-4 py-1 ${
                          state.paymentMethod === "fawry"
                            ? "bg-gray-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          setState({
                            ...state,
                            paymentMethod: "fawry",
                          })
                        }
                      >
                        <svg
                          width="60"
                          height="40"
                          xmlns="http://www.w3.org/2000/svg"
                          className="pt-2 ml-3"
                        >
                          <image
                            href="https://firebasestorage.googleapis.com/v0/b/comic-stop.appspot.com/o/assets%2FLogos%2FFawry.svg?alt=media&token=1d52094e-1d64-42d4-9036-173be33cfa6b"
                            width="30"
                            height="30"
                            className="my-auto p-5"
                          />
                        </svg>
                        <label
                          htmlFor="hs-list-group-item-checkbox-1"
                          class="ms-3.5 block w-full text-sm text-gray-600 dark:text-gray-500 my-3 mr-10 cursor-pointer"
                        >
                          Fawry Transfer
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
                <button
                  onClick={(e) => {
                    if (state.paymentMethod != "Paymob") {
                      setshowPaymentInstructions(true);
                    } else {
                      pay(
                        "Paymob",
                        data,
                        dispatch,
                        state,
                        setState,
                        getPaymentProcess,
                        finalCost,
                        history
                      );
                    }
                  }}
                  className={`w-full px-4 py-2 text-center text-white font-semibold ${
                    state.paymentMethod != null
                      ? "cursor-pointer"
                      : "cursor-default"
                  }`}
                  style={
                    state.paymentMethod != null
                      ? { background: "#303031" }
                      : { background: "#808080" }
                  }
                  disabled={state.paymentMethod != null ? false : true}
                >
                  Pay
                </button>
                <div className="flex items-center justify-center my-4">
                  <h2 className="text-gray-600 font-semibold">or</h2>
                </div>
                <button
                  onClick={(e) => {
                    pay(
                      "COD",
                      data,
                      dispatch,
                      state,
                      setState,
                      getPaymentProcess,
                      finalCost,
                      history
                    );
                  }}
                  className="w-full px-4 py-2 text-center text-white font-semibold cursor-pointer"
                  style={{ background: "#303031" }}
                >
                  Pay on delivery
                </button>
              </div>
            </Fragment>
          </div>
        </div>
      </section>
      <PaymentInstructions
        showPaymentInstructions={showPaymentInstructions}
        handleClosePaymentInstructions={() => setshowPaymentInstructions(false)}
        state={state}
        setState={setState}
        finalCost={finalCost}
      />
    </Fragment>
  );
};

const CheckoutProducts = ({ products, finalCost, setFinalCost, address }) => {
  const history = useHistory();
  const [coupon, setCoupon] = useState("");
  const [alert, setAlert] = useState("");
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [costBeforeShipping, setCostBeforeShipping] = useState(0);
  const shippingCost =
    address.governorate != "" ? parseInt(address.governorate) : null;

  const handleCouponInput = (e) => {
    setCoupon(e.target.value);
    setAlert("");
  };

  const applyShipping = (e) => {
    if (currentCoupon === null) {
      setFinalCost(totalCost() + shippingCost);
    } else {
      if (currentCoupon.type != "freeShipping") {
        console.log("apply shipping");
        console.log(costBeforeShipping);
        setFinalCost(costBeforeShipping + shippingCost);
      } else {
        console.log("remove shipping");
        console.log(costBeforeShipping);
        setFinalCost(costBeforeShipping);
      }
    }
  };

  //TODO: reset shipping cost when shipping address is changed

  useEffect(() => {
    if (alert !== "") {
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }
  }, [alert]);

  useEffect(() => {
    if (currentCoupon) {
      setCurrentCoupon(null);
    }
    applyShipping();
  }, [coupon]);

  useEffect(() => {
    applyShipping();
  }, [shippingCost, currentCoupon]);

  useEffect(() => {
    setFinalCost(Math.round(finalCost * 10) / 10);
  }, [finalCost]);

  return (
    <Fragment>
      <div className="grid grid-cols-2 md:grid-cols-1">
        {products !== null && products.length > 0 ? (
          <div>
            {products.map((product, index) => {
              return (
                <div
                  key={index}
                  className="col-span-1 m-2 md:py-6 md:border-t md:border-b md:my-2 md:mx-0 md:flex md:items-center md:justify-between"
                >
                  <div className="md:flex md:items-center md:space-x-4">
                    <img
                      onClick={(e) => history.push(`/products/${product._id}`)}
                      className="cursor-pointer md:h-20 md:w-20 object-cover object-center"
                      src={`${product.pImages[0]}`}
                      alt="wishListproduct"
                    />
                    <div className="text-lg md:ml-6 truncate">
                      {product.pName}
                    </div>
                    <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                      Price : EGP{product.pPrice}
                    </div>
                    <div className="md:ml-6 font-semibold text-gray-600 text-sm">
                      Quantity : {quantity(product._id)}
                    </div>
                    <div className="font-semibold text-gray-600 text-sm">
                      Subtotal : EGP{subTotal(product._id, product.pPrice)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div>
              <div className="flex flex-col py-2 mb-2">
                <label htmlFor="phone" className="pb-2">
                  Discount Code:
                </label>
                <div className="flex">
                  <input
                    value={coupon}
                    onChange={(e) => handleCouponInput(e)}
                    type="text"
                    id="discount_code"
                    className={
                      `border px-4 py-2` + (alert ? " border-red-500" : "")
                    }
                    placeholder="Discount Code..."
                  />

                  <button
                    onClick={(e) => {
                      applyCoupon(
                        coupon,
                        setCostBeforeShipping,
                        setAlert,
                        currentCoupon,
                        setCurrentCoupon
                      );
                    }}
                    className=" px-4 py-2 text-center text-white font-semibold cursor-pointer rounded-md ml-2"
                    style={{ background: "#303031" }}
                    disabled={coupon === "" ? true : false}
                  >
                    Apply
                  </button>
                </div>
                {alert != "" && (
                  <span className="pt-1 text-red-500 text-sm">{alert}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col mt-4">
              <div className="text-md">
                Subtotal:{" "}
                {currentCoupon && currentCoupon?.type != "freeShipping" && (
                  <s className="text-yellow-500 mx-2">EGP{totalCost()}</s>
                )}
                {(currentCoupon?.type !== "freeShipping" || !currentCoupon) &&
                  `EGP${finalCost - shippingCost}`}
                {currentCoupon &&
                  currentCoupon?.type === "freeShipping" &&
                  `EGP${finalCost}`}
              </div>
              <div className="text-md">
                Shipping:{" "}
                {currentCoupon?.type === "freeShipping" && (
                  <>
                    <s className="text-yellow-500 mx-2">EGP{shippingCost}</s>
                    EGP 0
                  </>
                )}
                {(currentCoupon?.type !== "freeShipping" ||
                  currentCoupon === null) &&
                  (shippingCost === null
                    ? "Please enter shipping address"
                    : ` EGP ${shippingCost}`)}
              </div>
              <div className="text-xl">
                Total Cost:{" "}
                {currentCoupon && (
                  <s className="text-yellow-500 mx-2">
                    EGP{totalCost() + shippingCost}
                  </s>
                )}
                EGP{finalCost}
              </div>
            </div>
          </div>
        ) : (
          <div>No product found for checkout</div>
        )}
      </div>
    </Fragment>
  );
};

export default CheckoutProducts;
