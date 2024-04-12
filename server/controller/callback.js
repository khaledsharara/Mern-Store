const crypto = require("crypto");
const axios = require("axios");

// Function to calculate HMAC
const calculateHmac = (data, secretKey) => {
  const sortedData = sortData(data);
  const concatenatedString = concatenateString(sortedData);
  const hmac = crypto.createHmac("sha512", secretKey);
  hmac.update(concatenatedString);
  return hmac.digest("hex");
};

// Function to sort data
const sortData = (data) => {
  return Object.keys(data)
    .sort()
    .reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {});
};

// Function to concatenate string
const concatenateString = (data) => {
  return Object.values(data).join("");
};

module.exports = {
  handleProcessedCallback: async (req, res) => {
    const jsonData = req.body.obj;

    console.log("JSON DATA IS", jsonData);

    const itemVariations = JSON.parse(
      jsonData.payment_key_claims.billing_data.extra_description
    );

    const transformedItems = [];

    jsonData.order.items.forEach((item) => {
      // Create a new object with the desired keys and values
      const transformedItem = {
        id: item.name,
        price: item.amount_cents / 100,
        totalAvailableQuantity: item.description,
        quantitiy: item.quantity,
        variations: itemVariations[item.name],
      };

      // Push the transformed item to the array
      transformedItems.push(transformedItem);
    });

    const orderData = {
      allProduct: transformedItems,
      user:
        jsonData.order.shipping_data.last_name === "user"
          ? jsonData.order.shipping_data.first_name
          : null,
      amount: jsonData.amount_cents / 100,
      transactionId: jsonData.order.merchant_order_id,
      address: jsonData.order.shipping_data.street,
      phone: jsonData.order.shipping_data.phone_number,
      guestInfo: {
        name:
          jsonData.order.shipping_data.last_name === "guest"
            ? jsonData.order.shipping_data.first_name
            : null,
        email:
          jsonData.order.shipping_data.last_name === "guest"
            ? jsonData.order.shipping_data.email
            : null,
      },
      paymentMethod: "paymob",
      transferSS: null,
    };

    console.log("order data", orderData);

    if (jsonData.success === false) {
      try {
        console.log("attempting order");
        let resposeData = await axios.post(
          `http://localhost:8000/api/order/create-order`,
          orderData
        );
        if (resposeData.success) {
          console.log("success");
          localStorage.setItem("cart", JSON.stringify([]));
        } else if (resposeData.error) {
          console.log(resposeData.error);
        }
      } catch (error) {
        console.log(error);
      }
      // res.sendStatus(200);
    } else {
      // Respond with error
      console.log("NOT SUCCESSFUL TRANSACTION");
    }
    // Respond with error
    console.log("items is", jsonData.order.items);
  },

  handleResponseCallback: (req, res) => {
    const {
      amount_cents,
      created_at,
      currency,
      error_occured,
      has_parent_transaction,
      id,
      integration_id,
      is_3d_secure,
      is_auth,
      is_capture,
      is_refunded,
      is_standalone_payment,
      is_voided,
      order: order_id,
      owner,
      pending,
      "source_data.pan": source_data_pan,
      "source_data.sub_type": source_data_sub_type,
      "source_data.type": source_data_type,
      success,
      merchant_order_id,
    } = req.query;

    const lexographicalString = `${amount_cents}${created_at}${currency}${error_occured}${has_parent_transaction}${id}${integration_id}${is_3d_secure}${is_auth}${is_capture}${is_refunded}${is_standalone_payment}${is_voided}${order_id}${owner}${pending}${source_data_pan}${source_data_sub_type}${source_data_type}${success}`;

    const hash = crypto
      .createHmac("sha512", process.env.PAYMOB_HMAC)
      .update(lexographicalString)
      .digest("hex");

    if (hash === req.query.hmac && success === "false") {
      // Assuming merchant_order_id is extracted from the query parameters
      const { merchant_order_id } = req.query;

      // Construct the redirect URL
      let redirectUrl = `http://localhost:3000/order/${merchant_order_id}`;

      // Redirect the client to the specified URL
      return res.redirect(redirectUrl);
    }

    redirectUrl = `http://localhost:3000/order/fail`;
    return res.redirect(redirectUrl);
  },
};
