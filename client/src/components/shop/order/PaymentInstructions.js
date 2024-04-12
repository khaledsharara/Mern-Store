import React, { Fragment, useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { LayoutContext } from "../layout";
import { subTotal, quantity, totalCost } from "../partials/Mixins";

import { cartListProduct } from "../partials/FetchApi";
import { getBrainTreeToken, getPaymentProcess } from "./FetchApi";
import { fetchData, fetchbrainTree, pay } from "./Action";

const PaymentInstructions = (props) => {
  const history = useHistory();
  const { data, dispatch } = useContext(LayoutContext);
  const [isHovered, setIsHovered] = useState(false);

  if (
    props.showPaymentInstructions === null ||
    props.showPaymentInstructions === false
  )
    return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
      id="productQuickViewBackground"
      onClick={(e) => {
        if (e.target.classList.contains("bg-opacity-50")) {
          props.handleClosePaymentInstructions();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && props.showPaymentInstructions) {
          props.handleClosePaymentInstructions();
        }
      }}
      tabIndex={0}
    >
      <div className="relative w-11/12 max-w-3xl mx-auto my-auto bg-white rounded-lg shadow-lg">
        <div className="relative flex flex-col items-center justify-center w-full">
          <div className="flex items-center justify-between w-full">
            <div className="absolute top-0 right-0 mt-4 mr-4">
              <button
                onClick={() => {
                  props.handleClosePaymentInstructions();
                }}
                className="text-3xl font-semibold leading-none focus:outline-none cursor-pointer"
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
            <ol class="grid gap-8 md:grid-cols-3 px-6 py-12">
              <li class="relative bg-gray-50 rounded-xl">
                <div class="p-6 space-y-4">
                  <div class="block w-10 h-10 mx-auto -mt-12 rounded-full ring-8 ring-white">
                    <div class="w-10 h-10 rounded-full shadow-sm">
                      <div class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-white rounded-full shadow-lg text-primary-600 tabular-nums">
                        1
                      </div>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <h3 class="text-xl font-bold tracking-tight md:text-2xl text-center">
                      Transfer the amount
                    </h3>
                  </div>

                  <hr class="border-gray-200 border-dashed" />
                  {(() => {
                    if (props.state.paymentMethod === "telda") {
                      return (
                        <p class="space-y-1 font-medium text-gray-500">
                          Simply transfer the amount to the following account:
                          @xxxxx.
                          <br />
                          Make sure to include your name in the "For" section.
                        </p>
                      );
                    } else if (props.state.paymentMethod === "instapay") {
                      return (
                        <p class="space-y-1 font-medium text-gray-500">
                          • Click on "Send Money"
                          <br />
                          • Choose to Payment Address “IPA”
                          <br />• Enter the IPA: @xxxxx & transfer amount
                        </p>
                      );
                    } else if (props.state.paymentMethod === "fawry") {
                      return (
                        <p class="space-y-1 font-medium text-gray-500">
                          • Go to your nearest Fawry service provider
                          <br />• Ask to transfer the amount to 011xxxxx
                        </p>
                      );
                    }
                  })()}
                </div>
              </li>

              <li class="relative bg-gray-50 rounded-xl">
                <div class="p-6 space-y-4">
                  <div class="block w-10 h-10 mx-auto -mt-12 rounded-full ring-8 ring-white">
                    <div class="w-10 h-10 rounded-full shadow-sm">
                      <div class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-white rounded-full shadow-lg text-primary-600 tabular-nums">
                        2
                      </div>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <h3 class="text-xl font-bold tracking-tight md:text-2xl text-center">
                      Take a screenshot.
                    </h3>
                  </div>

                  <hr class="border-gray-200 border-dashed" />

                  <p class="space-y-1 font-medium text-gray-500">
                    Don't forget to take a screenshot of the transfer success
                    message.
                  </p>
                </div>
              </li>

              <li class="relative bg-gray-50 rounded-xl">
                <div class="p-6 space-y-4">
                  <div class="block w-10 h-10 mx-auto -mt-12 rounded-full ring-8 ring-white">
                    <div class="w-10 h-10 rounded-full shadow-sm">
                      <div class="flex items-center justify-center w-10 h-10 text-lg font-bold bg-white rounded-full shadow-lg text-primary-600 tabular-nums">
                        3
                      </div>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <h3 class="text-xl font-bold tracking-tight md:text-2xl text-center">
                      Upload your screenshot
                    </h3>

                    <p class="text-gray-600">
                      Once done, upload your screenshot here and click confirm.
                    </p>
                  </div>

                  <hr class="border-gray-200 border-dashed" />

                  <div className="flex w-full items-center justify-center bg-grey-lighter">
                    <label
                      className={`w-64 flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer ${
                        isHovered
                          ? "group-hover:bg-blue group-hover:text-gray"
                          : ""
                      }`}
                      onMouseEnter={() => {
                        setIsHovered(true);
                      }}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <svg
                        className="w-8 h-8 transition-colors duration-300 ease-in-out"
                        fill={`${
                          isHovered ? "cornflowerblue" : "currentColor"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                      </svg>
                      <span className="mt-2 text-base leading-normal">
                        Select a file
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) =>
                          props.setState({
                            ...props.state,
                            transferSS: e.target.files[0],
                          })
                        }
                      />
                    </label>
                  </div>
                </div>
                <div
                  onClick={(e) => {
                    if (props.state.transferSS === null) return;
                    else {
                      pay(
                        "Transfer",
                        data,
                        dispatch,
                        props.state,
                        props.setState,
                        getPaymentProcess,
                        props.finalCost,
                        history
                      );
                    }
                  }}
                  className={`mx-5 px-4 py-2 text-center text-white font-semibold ${
                    props.state.transferSS === null ? "" : "cursor-pointer"
                  }`}
                  style={{
                    backgroundColor: props.state.transferSS
                      ? "#303031"
                      : "gray",
                  }}
                >
                  Confirm
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
