import React, { Fragment, useContext, useEffect, useState } from "react";
import { getAllCoupons, createCoupon, deleteCoupon } from "./FetchApi";
import CouponProductsModal from "./CouponProductsModal";

const CouponsCard = (props) => {
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState({
    Code: "",
    type: "",
    value: "",
    buyGetValue: [],
    allowedProducts: [],
    minimumTotal: "",
  });

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const checkSelectAll = (allProducts) => {
    if (coupon.allowedProducts.length === allProducts.length) return true;
    else return false;
  };

  const toggleProductInAllowedProducts = (productId) => {
    // Check if the product ID already exists in allowedProducts
    const isArray = Array.isArray(productId);

    if (isArray && coupon.allowedProducts.length === 0) {
      console.log("is Array");
      setCoupon(
        (prevCoupon) => ({
          ...prevCoupon,
          allowedProducts: productId,
        }),
        () => {
          console.log("allowed new:", coupon.allowedProducts);
        }
      );
      return;
    } else if (isArray && coupon.allowedProducts.length > 0) {
      setCoupon(
        (prevCoupon) => ({
          ...prevCoupon,
          allowedProducts: [],
        }),
        () => {
          console.log("allowed new:", coupon.allowedProducts);
        }
      );
      return;
    }

    const isProductInArray =
      coupon.allowedProducts.length > 0 &&
      coupon.allowedProducts.some(
        (existingProduct) =>
          existingProduct && existingProduct.toString() === productId.toString()
      );

    if (isProductInArray) {
      console.log("Product already in array");
      // If the product is already in the array, remove it
      const newAllowedProducts = coupon.allowedProducts.filter(
        (existingProduct) =>
          existingProduct && existingProduct.toString() !== productId.toString()
      );

      setCoupon(
        (prevCoupon) => ({
          ...prevCoupon,
          allowedProducts: newAllowedProducts,
        }),
        () => {
          console.log("allowed new:", coupon.allowedProducts);
        }
      );
    } else {
      // If the product is not in the array, add it
      console.log("Not in array");
      const newAllowedProducts = [...coupon.allowedProducts, productId];

      setCoupon(
        (prevCoupon) => ({
          ...prevCoupon,
          allowedProducts: newAllowedProducts,
        }),
        () => {
          console.log("allowed new:", coupon.allowedProducts);
        }
      );
    }
  };

  const isChecked = (product) => {
    return (
      coupon.allowedProducts.length > 0 &&
      coupon.allowedProducts.some(
        (existingProduct) =>
          existingProduct && String(existingProduct) === String(product)
      )
    );
  };

  const fetchCoupons = async () => {
    try {
      const response = await getAllCoupons();
      setCoupons(response.coupons);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleClearingValues = async () => {
    console.log("Clearing values");
    setCoupon({
      ...coupon,
      Code: "",
      value: "",
      buyGetValue: ["", ""],
      allowedProducts: [],
      minimumTotal: "",
    });
    console.log("Cleared", coupon);
  };

  const handleCreateCoupon = async () => {
    try {
      const createdCoupon = await createCoupon(coupon);
      console.log("Created Coupon:", createdCoupon);
      await handleClearingValues();
      setCoupon({
        type: "",
      });
      fetchCoupons();
    } catch (error) {
      console.error("Error creating coupon:", error);
    }
  };

  const deleteCouponAndUpdate = async (orderID) => {
    await deleteCoupon(orderID);
    fetchCoupons();
  };

  const checkValidCoupon = () => {
    const commonChecks =
      coupon.minimumTotal !== "" &&
      coupon.minimumTotal > 0 &&
      coupon.Code !== "";

    switch (coupon.type) {
      case "fixed":
        return (
          commonChecks &&
          coupon.value !== "" &&
          coupon.value > 0 &&
          coupon.allowedProducts.length > 0
        );
      case "percent":
        return (
          commonChecks &&
          coupon.value !== "" &&
          coupon.value > 0 &&
          coupon.value <= 100
        );
      case "buyGet":
        return (
          commonChecks &&
          coupon.buyGetValue[0] !== "" &&
          coupon.buyGetValue[0] > 0 &&
          coupon.buyGetValue[1] !== "" &&
          coupon.buyGetValue[1] > 0
        );
      case "freeShipping":
        return commonChecks;
      default:
        return false;
    }
  };

  useEffect(() => {
    fetchCoupons();
    checkValidCoupon();
    console.log("Coupon validity:", checkValidCoupon());
  }, []);

  useEffect(() => {
    handleClearingValues();
  }, [coupon.type]);

  useEffect(() => {
    console.log("Allowed products", coupon.allowedProducts);
  }, [coupon.allowedProducts]);

  return (
    <Fragment>
      <div className="relative m-4 bg-white p-4 shadow-lg">
        <h1 className="border-b-2 border-yellow-700 mb-4 pb-2 text-2xl font-semibold">
          Coupons
        </h1>
        <div className="my-4">
          <table className="table-auto border w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Code</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Value</th>
                <th className="px-4 py-2 border">Buy, Get</th>
                <th className="px-4 py-2 border">Allowed Products</th>
                <th className="px-4 py-2 border">Minimum Total</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length ? (
                coupons
                  .slice()
                  .reverse()
                  .map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">{coupon.Code}</td>
                      <td className="px-4 py-2 border">{coupon.type}</td>
                      <td className="px-4 py-2 border">
                        {coupon.type === "percent" && `${coupon.value}%`}
                        {coupon.type === "fixed" && `EGP ${coupon.value}`}
                        {(coupon.type === "buyGet" ||
                          coupon.type === "freeShipping") &&
                          "N/A"}
                      </td>
                      <td className="px-4 py-2 border">
                        {coupon.type === "buyGet"
                          ? coupon.buyGetValue.join(", ")
                          : "N/A"}
                      </td>
                      {/* {coupon.allowedProducts} length */}
                      <td className="px-4 py-2 border">
                        {coupon.allowedProducts?.length}
                      </td>
                      <td className="px-4 py-2 border">
                        {coupon.minimumTotal}
                      </td>
                      <td className="px-4 py-2 border">
                        <span
                          onClick={(e) => deleteCouponAndUpdate(coupon._id)}
                          className="cursor-pointer rounded-lg p-2 mx-1"
                        >
                          <svg
                            className="w-6 h-6 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-xl text-center font-semibold py-8"
                  >
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex mb-6">
          <div className="w-full px-3 my-auto relative">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Coupon Type
            </label>
            <div className="flex">
              <select
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={coupon.type}
                onChange={(e) => {
                  handleClearingValues();
                  setCoupon({
                    ...coupon,
                    type: e.target.value,
                  });
                }}
              >
                <option value="">Select Type</option>
                <option value="fixed">Fixed</option>
                <option value="percent">Percent</option>
                <option value="buyGet">Buy Get</option>
                <option value="freeShipping">Free Shipping</option>
              </select>
              <svg
                className="fill-current h-4 w-4 absolute right-0 top-1 mt-3 mr-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Coupon Code
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={coupon.Code}
              placeholder="50OFF, 10PERCENT, etc."
              onChange={(e) =>
                setCoupon({
                  ...coupon,
                  Code: e.target.value,
                })
              }
            />
          </div>
          {(coupon.type === "fixed" || coupon.type === "percent") && (
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Value
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="number"
                placeholder="10, 20 etc."
                value={coupon.value}
                onChange={(e) =>
                  setCoupon({
                    ...coupon,
                    value: e.target.value,
                  })
                }
              />
            </div>
          )}
          {coupon.type === "buyGet" && (
            <>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Buy
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  placeholder="2, 3 etc."
                  value={coupon.buyGetValue?.[0]}
                  onChange={(e) =>
                    setCoupon({
                      ...coupon,
                      buyGetValue: [e.target.value, coupon.buyGetValue[1]],
                    })
                  }
                />
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Get
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type="number"
                  placeholder="1, 2 etc."
                  value={coupon.buyGetValue?.[1]}
                  onChange={(e) =>
                    setCoupon({
                      ...coupon,
                      buyGetValue: [coupon.buyGetValue[0], e.target.value],
                    })
                  }
                />
              </div>
            </>
          )}
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Minimum total
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="number"
              placeholder="100, 200 etc."
              value={coupon.minimumTotal}
              onChange={(e) => {
                setCoupon({
                  ...coupon,
                  minimumTotal: e.target.value,
                });
                console.log("validity", checkValidCoupon());
              }}
            />
          </div>
          <div className="w-full px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Allowed Products
            </label>
            <button
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              onClick={(e) => {
                setIsProductModalOpen(true);
              }}
            >
              {coupon.allowedProducts?.length > 0
                ? coupon.allowedProducts.length
                : "Add"}{" "}
              Products
            </button>
          </div>
          <div className="w-full flex justify-center items-center px-3 mt-6">
            <div className="w-full my-auto">
              <button
                onClick={(e) => {
                  handleCreateCoupon();
                  handleClearingValues();
                }}
                style={{
                  background:
                    checkValidCoupon() === true ? "#303031" : "#d3d3d3",
                  cursor: checkValidCoupon() === true ? "pointer" : "default",
                }}
                disabled={checkValidCoupon() === true ? false : true}
                className="px-4 py-2 text-white rounded-full"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      {isProductModalOpen && (
        <CouponProductsModal
          toggleProductInAllowedProducts={toggleProductInAllowedProducts}
          setIsProductModalOpen={setIsProductModalOpen}
          isChecked={isChecked}
          checkSelectAll={checkSelectAll}
        />
      )}
    </Fragment>
  );
};

export default CouponsCard;
