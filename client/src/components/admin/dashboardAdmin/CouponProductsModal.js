import React, { Fragment, useContext, useEffect, useState } from "react";
import { getAllProduct, deleteProduct } from "../products/FetchApi";
import moment from "moment";
import { DashboardContext } from "./index";

const apiURL = process.env.REACT_APP_API_URL;

const CouponProductsModal = ({
  setIsProductModalOpen,
  toggleProductInAllowedProducts,
  checkSelectAll,
  isChecked,
}) => {
  const { data, dispatch } = useContext(DashboardContext);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let responseData = await getAllProduct();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        setProducts(responseData.Products);
        setLoading(false);
      }
    }, 1000);
  };

  /* This method call the editmodal & dispatch product context */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const divElement = document.getElementById("ModalBackground");
    if (divElement) {
      divElement.focus();
    }
  }, []);

  const handleSelectAll = () => {
    const allProductIds = products.map((product) => product._id);
    toggleProductInAllowedProducts(allProductIds);
  };

  if (loading) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
        id="ModalBackground"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsProductModalOpen(false);
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
            setIsProductModalOpen(false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsProductModalOpen(false);
          }
        }}
        tabIndex={0}
      >
        <div className="relative w-11/12 max-w-3xl mx-auto my-auto bg-white rounded-lg shadow-lg">
          <div className="relative flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-between w-full">
              <div
                style={{
                  maxHeight: "450px",
                }}
                className="w-full overflow-y-scroll overflow-x-hidden"
              >
                <table className="table-auto border w-full m-5">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 border">Product</th>
                      <th className="px-4 py-2 border">Image</th>
                      <th className="px-4 py-2 border">Category</th>
                      <th className="px-4 py-2 border">
                        <div className="flex items-center justify-center mb-4">
                          <input
                            type="checkbox"
                            value=""
                            checked={checkSelectAll(products)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            onChange={() => {
                              handleSelectAll();
                            }}
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.length > 0 ? (
                      products.map((item, key) => (
                        <ProductTable
                          product={item}
                          key={key}
                          toggleProductInAllowedProducts={
                            toggleProductInAllowedProducts
                          }
                          isChecked={isChecked}
                        />
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-xl text-center font-semibold py-8"
                        >
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={(e) => {
                setIsProductModalOpen(false);
              }}
              style={{
                background: "#303031",
                cursor: "pointer",
              }}
              className="px-4 py-2 text-white rounded-full self-end m-5"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
};

const ProductTable = ({
  product,
  toggleProductInAllowedProducts,
  isChecked,
}) => {
  return (
    <Fragment>
      <tr>
        <td className="p-2 text-left">
          {product.pName.length > 15
            ? product.pDescription.substring(1, 15) + "..."
            : product.pName}
        </td>
        <td className="p-2 text-center">
          <img
            className="w-12 h-12 object-cover object-center"
            src={`${product.pImages[0]}`}
            alt="pic"
          />
        </td>
        <td className="p-2 text-center">
          {product.pCategory ? product.pCategory.cName : "N/A"}
        </td>
        <td className="p-2 text-center">
          <div className="flex items-center justify-center mb-4">
            <input
              type="checkbox"
              value=""
              checked={isChecked(product._id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={() => {
                toggleProductInAllowedProducts(product._id);
                console.log(product);
              }}
            />
          </div>
        </td>
      </tr>
    </Fragment>
  );
};

export default CouponProductsModal;
