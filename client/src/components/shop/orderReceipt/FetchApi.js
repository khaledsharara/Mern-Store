import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getOrderByID = async (id) => {
  try {
    // Make a GET request to fetch the order by its ID
    console.log("waiting res for", id);
    const response = await axios.get(`${apiURL}/api/order/order/${id}`);
    // Extract the order data from the response
    const order = response.data.order;
    // Return the order data
    return order;
  } catch (error) {
    // Handle errors, e.g., network error or invalid response
    console.error("Error fetching order:", error);
    // Return null or throw an error based on your application logic
    return null;
  }
};

export const getProduct = async (pId) => {
  try {
    console.log("attempting api");
    let res = await axios.post(`${apiURL}/api/product/single-product`, {
      pId: pId,
    });
    console.log("done fetching product");
    console.log("res", res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
