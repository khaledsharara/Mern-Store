import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout";
import { getOrderByID, getProduct } from "./FetchApi";

const OrderReceiptComponent = () => {
  const { order } = useParams();
  const [orderInfo, setOrderInfo] = useState({});
  const [productInfo, setProductInfo] = useState({});
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(0);

  useEffect(() => {
    const fetchProductData = async (productId) => {
      try {
        console.log("fetching product data for Id ", productId);
        let productData = await getProduct(productId);
        console.log("productData", productData);
        setProductInfo((prevProductInfo) => ({
          ...prevProductInfo,
          [productId._id]: productData,
        }));
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    // Call fetchProductData function for each product

    if (orderInfo?.allProduct) {
      orderInfo.allProduct.forEach((product) => {
        console.log("fetching product data for", product);
        fetchProductData(product.id);
        setTotalWithoutDiscount((prevTotal) => {
          return prevTotal + product.id.pPrice * product.quantitiy;
        });
      });
    }
    if (orderInfo?.address) {
      const addressString = orderInfo?.address;
      const lastIndex = addressString.lastIndexOf(",");
      setAddress(addressString.slice(0, lastIndex));
      setShipping(addressString.slice(lastIndex + 1));

      console.log("Address:", address);
      console.log("Shipping:", shipping);
    }

    if (orderInfo?.allProduct) {
      setLoading(false);
    }
  }, [orderInfo]);

  useEffect(() => {
    console.log("productInfo", productInfo);
    console.log("Address:", address);
    console.log("Shipping:", shipping);
    console.log("Total without discount:", totalWithoutDiscount);
  }, [productInfo]);

  useEffect(() => {
    async function fetchOrder() {
      let orderData = await getOrderByID(order);
      setOrderInfo(orderData);
    }
    fetchOrder();
  }, []);

  const fetchProductInfo = async (id) => {
    const productInfo = await getProduct(id);
    return productInfo;
  };

  // Format the date using toLocaleDateString and toLocaleTimeString
  const originalDate = new Date(orderInfo.createdAt);
  const formattedDate = originalDate.toLocaleDateString();
  const formattedTime = originalDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) {
    return (
      <div className="col-span-2 md:col-span-3 lg:col-span-4 flex items-center justify-center py-24 my-auto h-screen">
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
    );
  } else {
    return (
      <section className="mt-32 mb-10 w-3/4 mx-auto">
        <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
          <div className="flex justify-start item-start space-y-2 flex-col ">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
              Order #{orderInfo.transactionId}
            </h1>
            <p className="text-base font-medium leading-6 text-gray-600">
              {formattedDate} at {formattedTime}
            </p>
          </div>
          <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch  w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
                <p className="text-lg md:text-xl font-semibold leading-6 xl:leading-5 text-gray-800">
                  Your Cart
                </p>

                {orderInfo != {}
                  ? orderInfo?.allProduct?.map((product, index) => (
                      <div className="mt-4 md:mt-6 flex  flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full ">
                        <div className="pb-4 md:pb-8 w-full md:w-40">
                          <img
                            className="w-full hidden md:block"
                            src={
                              productInfo[product.id._id]?.Product.pImages[0]
                            }
                            alt="product image"
                          />
                        </div>
                        <div
                          key={index}
                          className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0"
                        >
                          <div className="w-full flex flex-col justify-start items-start space-y-8">
                            <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                              {productInfo[product.id._id]?.Product.pName}
                            </h3>
                            <div className="flex justify-start items-start flex-col space-y-2">
                              {product.variations?.map((variation, index) => (
                                <p className="text-sm leading-none text-gray-800">
                                  <span className="text-gray-500">
                                    {variation.variation}:{" "}
                                  </span>{" "}
                                  {variation.value}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="flex justify-between space-x-8 items-start w-full">
                            <p className="text-base xl:text-lg leading-6">
                              EGP {productInfo[product.id._id]?.Product.pPrice}{" "}
                            </p>
                            <p className="text-base xl:text-lg leading-6 text-gray-800">
                              {product.quantitiy}
                            </p>
                            <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                              EGP{" "}
                              {productInfo[product.id._id]?.Product.pPrice *
                                product.quantitiy}{" "}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
              <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    Summary
                  </h3>
                  <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                    <div className="flex justify-between  w-full">
                      <p className="text-base leading-4 text-gray-800">
                        Subtotal
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        EGP {Number(orderInfo?.amount) - Number(shipping)}
                      </p>
                    </div>

                    {Number(totalWithoutDiscount) -
                      Number(orderInfo?.amount) +
                      Number(shipping) >
                      0 && (
                      <div className="flex justify-between items-center w-full">
                        <p className="text-base leading-4 text-gray-800">
                          Discount{" "}
                          {/* <span className="bg-gray-200 p-1 text-xs font-medium leading-3  text-gray-800">
                          STUDENT
                        </span> */}
                        </p>
                        <p className="text-base leading-4 text-gray-600">
                          -EGP{" "}
                          {Number(totalWithoutDiscount) -
                            Number(orderInfo?.amount) +
                            Number(shipping)}{" "}
                          (
                          {((Number(totalWithoutDiscount) -
                            Number(orderInfo?.amount) +
                            Number(shipping)) /
                            (Number(orderInfo?.amount) - Number(shipping))) *
                            100}
                          %)
                        </p>
                      </div>
                    )}
                    <div className="flex justify-between items-center w-full">
                      <p className="text-base leading-4 text-gray-800">
                        Shipping
                      </p>
                      <p className="text-base leading-4 text-gray-600">
                        {shipping}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      Total
                    </p>
                    <p className="text-base font-semibold leading-4 text-gray-600">
                      EGP {orderInfo?.amount}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 space-y-6   ">
                  <h3 className="text-xl font-semibold leading-5 text-gray-800">
                    Shipping
                  </h3>
                  <div className="flex justify-between items-start w-full h-full">
                    <div className="flex justify-center items-center space-x-4">
                      <div className="w-8 h-8">
                        <img
                          className="w-full h-full"
                          alt="logo"
                          src="https://i.ibb.co/L8KSdNQ/image-3.png"
                        />
                      </div>
                      <div className="flex flex-col justify-start items-center">
                        <p className="text-lg leading-6 font-semibold text-gray-800">
                          Shipping Address
                          <br />
                          <span className="font-normal">{address}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold leading-6 text-gray-800">
                      EGP{shipping}
                    </p>
                  </div>
                  {/* <div className="w-full flex justify-center items-center">
                  <button className="hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">
                    View Carrier Details
                  </button>
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

const OrderReceipt = () => {
  return (
    <Fragment>
      <Layout children={<OrderReceiptComponent />} />
    </Fragment>
  );
};

export default OrderReceipt;
