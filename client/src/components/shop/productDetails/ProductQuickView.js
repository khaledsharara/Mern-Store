import React, { Fragment, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";

import { getSingleProduct } from "./FetchApi";
import { cartListProduct } from "../partials/FetchApi";
import { isWishReq, unWishReq, isWish } from "../home/Mixins";
import { updateQuantity, slideImage, addToCart, cartList } from "./Mixins";
import { totalCost } from "../partials/Mixins";

const apiURL = process.env.REACT_APP_API_URL;

const ProductQuickView = (props) => {
  let { id } = props;
  const data = props.data;
  const dispatch = props.dispatch;
  const history = useHistory();

  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext); // Layout Context
  const item = layoutData.singleProductDetail;
  const [pImages, setPimages] = useState(null);
  const [count, setCount] = useState(0); // Slide change state

  const [quantitiy, setQuantitiy] = useState(1); // Increse and decrese quantity state
  const [, setAlertq] = useState(false); // Alert when quantity greater than stock

  const [wList, setWlist] = useState(
    JSON.parse(localStorage.getItem("wishList"))
  ); // Wishlist State Control

  useEffect(() => {
    {
      !item && fetchData();
      console.log("item none", item);
    }
    console.log("item found", item);
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const divElement = document.getElementById("productQuickViewBackground");
    if (divElement) {
      divElement.focus();
    }
  }, []);

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      let responseData = await getSingleProduct(id);
      console.log("product id is", id);
      setTimeout(() => {
        if (responseData.Product) {
          console.log("you got a product!!", responseData.Product);
          console.log("the item is ", item);
          layoutDispatch({
            type: "singleProductDetail",
            payload: responseData.Product,
          }); // Dispatch in layout context
          setPimages(responseData.Product.pImages);
          dispatch({ type: "loading", payload: false });
          layoutDispatch({ type: "inCart", payload: cartList() }); // This function change cart in cart state
        }
        if (responseData.error) {
          console.log(responseData.error);
        }
      }, 500);
    } catch (error) {
      console.log(error);
    }
    fetchCartProduct(); // Updating cart total
  };

  const fetchCartProduct = async () => {
    try {
      let responseData = await cartListProduct();
      if (responseData && responseData.Products) {
        layoutDispatch({ type: "cartProduct", payload: responseData.Products }); // Layout context Cartproduct fetch and dispatch
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (!item) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
        id="productQuickViewBackground"
        onKeyDown={(e) => {
          if (e.key === "Escape" && item) {
            props.handleCloseQuickView();
            layoutDispatch({
              type: "singleProductDetail",
              payload: null,
            });
          }
        }}
        tabIndex={0}
      >
        <div className="relative w-11/12 max-w-3xl mx-auto my-auto bg-white rounded-lg shadow-lg">
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center">
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
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
        id="productQuickViewBackground"
        onClick={(e) => {
          if (e.target.classList.contains("bg-gray-900")) {
            props.handleCloseQuickView();
            layoutDispatch({
              type: "singleProductDetail",
              payload: null,
            });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape" && item) {
            props.handleCloseQuickView();
            layoutDispatch({
              type: "singleProductDetail",
              payload: null,
            });
          }
        }}
        tabIndex={0}
      >
        <div className="relative w-11/12 max-w-3xl mx-auto my-auto bg-white rounded-lg shadow-lg">
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-between w-full">
              <div className="grid grid-cols-2 md:grid-cols-12">
                <div className="col-span-2 md:col-span-7">
                  <div className="relative">
                    <div dir="ltr">
                      <img
                        className="w-full rounded-l-lg"
                        src={`${item.pImages[count]}`}
                        alt="Pic"
                      />
                    </div>
                    <div className="absolute inset-0 flex justify-between items-center mb-4">
                      <svg
                        onClick={(e) =>
                          slideImage("increase", null, count, setCount, pImages)
                        }
                        className="flex justify-center  w-12 h-12 text-gray-700 opacity-25 cursor-pointer hover:text-yellow-700 hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <svg
                        onClick={(e) =>
                          slideImage("increase", null, count, setCount, pImages)
                        }
                        className="flex justify-center  w-12 h-12 text-gray-700 opacity-25 cursor-pointer hover:text-yellow-700 hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 mt-8 pt-5 md:mt-0 md:col-span-4 md:ml-6 lg:ml-12">
                  <div className="flex flex-col leading-8">
                    <div className="text-2xl tracking-wider">
                      <span
                        onClick={() => history.push(`/products/${item._id}`)}
                        className="cursor-pointer "
                      >
                        {item.pName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      {item.pOffer && item.pOffer > 0 && (
                        <span className="text-xl tracking-wider text-gray">
                          <s>EGP{item.pPriceOriginal}</s>
                        </span>
                      )}

                      <span className="text-xl tracking-wider text-yellow-700">
                        EGP{item.pPrice}
                      </span>
                      <span>
                        <svg
                          onClick={(e) => isWishReq(e, item._id, setWlist)}
                          className={`${
                            isWish(item._id, wList) && "hidden"
                          } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <svg
                          onClick={(e) => unWishReq(e, item._id, setWlist)}
                          className={`${
                            !isWish(item._id, wList) && "hidden"
                          } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="my-4 md:my-6 text-gray-600">
                    {item.pDescription.length > 100
                      ? `${item.pDescription.substring(
                          0,
                          item.pDescription.lastIndexOf(" ", 100)
                        )}...`
                      : item.pDescription}
                  </div>
                  <div className="my-4 md:my-6">
                    {+quantitiy === +item.pQuantity ? (
                      <span className="text-xs text-red-500">
                        Stock limited
                      </span>
                    ) : (
                      ""
                    )}
                    <div
                      className={`flex justify-between items-center px-4 py-2 border ${
                        +quantitiy === +item.pQuantity && "border-red-500"
                      }`}
                    >
                      <div
                        className={`${
                          quantitiy === item.pQuantity && "text-red-500"
                        }`}
                      >
                        Quantity
                      </div>
                      {/* Quantity Button */}
                      {item.pQuantity !== 0 ? (
                        <Fragment>
                          {layoutData.inCart == null ||
                          (layoutData.inCart !== null &&
                            layoutData.inCart.includes(item._id) === false) ? (
                            <div className="flex items-center space-x-2">
                              <span
                                onClick={(e) =>
                                  updateQuantity(
                                    "decrease",
                                    item.pQuantity,
                                    quantitiy,
                                    setQuantitiy,
                                    setAlertq
                                  )
                                }
                              >
                                <svg
                                  className="w-5 h-5 fill-current cursor-pointer"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                              <span className="font-semibold">{quantitiy}</span>
                              <span
                                onClick={(e) =>
                                  updateQuantity(
                                    "increase",
                                    item.pQuantity,
                                    quantitiy,
                                    setQuantitiy,
                                    setAlertq
                                  )
                                }
                              >
                                <svg
                                  className="w-5 h-5 fill-current cursor-pointer"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span>
                                <svg
                                  className="w-5 h-5 fill-current cursor-not-allowed"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                              <span className="font-semibold">{quantitiy}</span>
                              <span>
                                <svg
                                  className="w-5 h-5 fill-current cursor-not-allowed"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                          )}
                        </Fragment>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>
                            <svg
                              className="w-5 h-5 fill-current cursor-not-allowed"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="font-semibold">{quantitiy}</span>
                          <span>
                            <svg
                              className="w-5 h-5 fill-current cursor-not-allowed"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        </div>
                      )}
                      {/* Quantity Button End */}
                    </div>
                    {/* Incart and out of stock button */}
                    {item.pQuantity !== 0 ? (
                      <Fragment>
                        {layoutData.inCart !== null &&
                        layoutData.inCart.includes(item._id) === true ? (
                          <div
                            style={{ background: "#303031" }}
                            className={`px-4 py-2 mt-5 text-white text-center cursor-not-allowed uppercase opacity-75`}
                          >
                            In cart
                          </div>
                        ) : (
                          <div
                            onClick={(e) =>
                              addToCart(
                                item._id,
                                quantitiy,
                                item.pPrice,
                                item.pQuantity,
                                null,
                                layoutDispatch,
                                setQuantitiy,
                                setAlertq,
                                fetchData,
                                totalCost
                              )
                            }
                            style={{ background: "#303031" }}
                            className={`px-4 py-2 mt-5 text-white text-center cursor-pointer uppercase`}
                          >
                            Add to cart
                          </div>
                        )}
                      </Fragment>
                    ) : (
                      <Fragment>
                        {layoutData.inCart !== null &&
                        layoutData.inCart.includes(item._id) === true ? (
                          <div
                            style={{ background: "#303031" }}
                            className={`px-4 py-2 mt-5 text-white text-center cursor-not-allowed uppercase opacity-75`}
                          >
                            In cart
                          </div>
                        ) : (
                          <div
                            style={{ background: "#303031" }}
                            disabled={true}
                            className="px-4 py-2 text-white opacity-50 cursor-not-allowed text-center uppercase"
                          >
                            Out of stock
                          </div>
                        )}
                      </Fragment>
                    )}
                    {/* Incart and out of stock button End */}
                  </div>
                  <div className="my-4 md:my-6">
                    <button
                      class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                      onClick={(e) => history.push(`/products/${item._id}`)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>

                      <span className="text-xs">View Details</span>
                    </button>
                  </div>
                </div>
                {/* add a Close button as the letter X */}
                <div className="absolute top-0 right-0 mt-4 mr-4">
                  <button
                    onClick={() => {
                      props.handleCloseQuickView();
                      layoutDispatch({
                        type: "singleProductDetail",
                        payload: null,
                      });
                    }}
                    className="text-3xl font-semibold leading-none focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductQuickView;
