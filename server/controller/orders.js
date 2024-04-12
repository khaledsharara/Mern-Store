const orderModel = require("../models/orders");
const productModel = require("../models/products");
const users = require("../models/users");
const nodemailer = require("nodemailer");

class Order {
  async getAllOrders(req, res) {
    try {
      let Orders = await orderModel
        .find({})
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email")
        .sort({ _id: -1 });
      if (Orders) {
        return res.json({ Orders });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOrderByUser(req, res) {
    let { uId } = req.body;
    if (!uId) {
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        let Order = await orderModel
          .find({ user: uId })
          .populate("allProduct.id", "pName pImages pPrice")
          .populate("user", "name email")
          .sort({ _id: -1 });
        if (Order) {
          return res.json({ Order });
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  async postCreateOrder(req, res) {
    console.log("req.body", req.body);

    let {
      allProduct, //
      user,
      amount, //
      transactionId, //
      address, //
      phone, //
      guestInfo,
      paymentMethod,
      transferSS, //
    } = req.body;
    if (
      !allProduct ||
      !(user || guestInfo) ||
      !amount ||
      !transactionId ||
      !address ||
      !phone
    ) {
      // console.log("All filled must be required");
      return res.json({ message: "All filled must be required" });
    } else {
      try {
        //check if product isVariantion

        let outOfStock = [];
        let variationCombination = [];

        // figure out which combination of variation is selected
        allProduct.forEach(async (item) => {
          let product = await productModel.findById(item.id);
          console.log("itemID", item.id);
          console.log("item", item);
          console.log("product", product);
          if (product.isVariation === true) {
            variationCombination = [];
            item.variations.forEach(async (variation) => {
              variationCombination.push(variation.value);
            });

            console.log("variationCombination", variationCombination);
            let currentProduct = await productModel.findById(item.id);
            console.log("currentProduct", currentProduct);
            console.log(
              "currentProduct.pVariations",
              currentProduct.pVariations
            );
            let variationIndex = currentProduct.pVariations.findIndex(
              (variation) => {
                return (
                  variation.values.toString() ===
                  variationCombination.toString()
                );
              }
            );
            console.log("variationIndex", variationIndex);
            let newQuantity =
              currentProduct.pVariations[variationIndex].quantity -
              item.quantitiy;
            console.log("newQuantity", newQuantity);
            if (newQuantity < 0) {
              console.log("out of stock");
              outOfStock.push(item.pName);
            } else {
              console.log("CURRENT PSOLD", currentProduct.pSold);
              console.log("ITEM QUANTITY", item.quantitiy);
              let newPSold =
                Number(currentProduct.pSold) + Number(item.quantitiy);
              console.log("NEW PSOLD IS", newPSold);
              let currentProduct = await productModel.findByIdAndUpdate(
                item.id,
                {
                  [`pVariations.${variationIndex}.quantity`]: newQuantity,
                }
              );
            }
          } else {
            let newQuantity = item.totalAvailableQuantity - item.quantitiy;
            console.log("productPSOLD", product.pSold);
            console.log("itemQUANTITY", item.quantitiy);
            let newPSold = Number(product.pSold) + Number(item.quantitiy);
            console.log("item", item);
            if (newQuantity < 0) {
              outOfStock.push(item.pName);
            } else {
              let currentProduct = await productModel.findByIdAndUpdate(
                item.id,
                {
                  pQuantity: newQuantity,
                  pSold: newPSold,
                }
              );
            }
          }
        });

        if (outOfStock.length > 0) {
          return res.json({ error: "Out of stock: " + outOfStock.join(", ") });
        }

        let newOrder = new orderModel({
          allProduct,
          user,
          amount,
          transactionId,
          address,
          phone,
          guestInfo,
          paymentMethod,
          transferSS,
        });
        console.log("newOrder", newOrder);
        let save = await newOrder.save();

        //get products name and price from database using id, and set it in an array of objects that has {pName, pPrice, quantitiy, pImage}
        let products = [];
        for (let i = 0; i < allProduct.length; i++) {
          let product = await productModel.findById(allProduct[i].id);
          products.push({
            pName: product.pName,
            pImage: product.pImages[0],
            pPrice: product.pPrice,
            quantitiy: allProduct[i].quantitiy,
          });
        }

        let adminEmail = await users.findOne({ userRole: "1" });

        if (!user) {
          sendUserOrderPlacedEmail(
            guestInfo,
            products,
            amount,
            transactionId,
            address,
            phone,
            paymentMethod
          );

          sendAdminEmail(
            guestInfo,
            adminEmail,
            products,
            amount,
            transactionId,
            address,
            phone
          );
        } else {
          let customer = await users.findById(user);
          sendUserOrderPlacedEmail(
            customer,
            products,
            amount,
            transactionId,
            address,
            phone,
            paymentMethod
          );

          sendAdminEmail(
            customer,
            adminEmail,
            products,
            amount,
            transactionId,
            address,
            phone
          );
        }

        if (save) {
          // send mail to user that order is placed successfully, and send mail to admin that new order is placed with order details
          return res.json({ success: "Order created successfully" });
        }
      } catch (err) {
        return res.json({ error: err });
      }
    }
  }

  async postUpdateOrder(req, res) {
    let { oId, status } = req.body;
    if (!oId || !status) {
      return res.json({ message: "All filled must be required" });
    } else {
      let currentOrder = orderModel.findByIdAndUpdate(oId, {
        status: status,
        updatedAt: Date.now(),
      });
      currentOrder.exec(async (err, result) => {
        if (err) console.log(err);
        //send mail to user that order is updated with the new status

        //get products name and price from database using id, and set it in an array of objects that has {pName, pPrice, quantitiy, pImage}
        let products = [];
        for (let i = 0; i < result.allProduct.length; i++) {
          let product = await productModel.findById(result.allProduct[i].id);
          products.push({
            pName: product.pName,
            pImage: product.pImages[0],
            pPrice: product.pPrice,
            quantitiy: result.allProduct[i].quantitiy,
          });
        }

        //if guest user send mail to guest user
        if (!result.user) {
          sendUserOrderUpdatedEmail(
            result.guestInfo,
            products,
            result.amount,
            result.transactionId,
            result.address,
            result.phone,
            result.paymentMethod,
            status
          );
        } else {
          let user = users.findById(result.user);
          sendUserOrderUpdatedEmail(
            user,
            products,
            result.amount,
            result.transactionId,
            result.address,
            result.phone,
            result.paymentMethod,
            status
          );
        }
        return res.json({ success: "Order updated successfully" });
      });
      // if order is updated then send mail to user that order is updated with the new status
    }
  }

  async getOrderByID(req, res) {
    try {
      const { transactionId } = req.params; // Assuming the transactionId is in the URL parameters
      console.log("Looking for", transactionId);

      // Query the database to find the order by its transactionId
      const order = await orderModel
        .findOne({ transactionId }) // Find the order by transactionId
        .populate("allProduct.id", "pName pImages pPrice")
        .populate("user", "name email");

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      console.log("order found", order);
      return res.json({ order });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async postDeleteOrder(req, res) {
    let { oId } = req.body;
    if (!oId) {
      return res.json({ error: "All filled must be required" });
    } else {
      try {
        let deleteOrder = await orderModel.findByIdAndDelete(oId);
        // if order is deleted then send mail to user that order is deleted
        if (deleteOrder) {
          return res.json({ success: "Order deleted successfully" });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

const sendUserOrderPlacedEmail = async (
  user,
  allProduct,
  amount,
  transactionId,
  address,
  phone,
  paymentMethod
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const htmlFile = `
  <div style="width: 100%; background-color: #f2f2f2; padding: 50px 0;">
  <div style="width: 80%; margin: auto; background-color: #fff; padding: 50px 0;">
    <div style="width: 80%; margin: auto;">
      <div style="text-align: center;">
        <h2 style="color: #ff4d4d;">Order Placed Successfully</h2>
        <p style="color: #000;">Your order has been placed successfully. Your order details are below:</p>
      </div>
      <div style="margin-top: 50px;">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background-color: #ff4d4d; color: #fff;">
          <h2>Order Details</h2>
        </div>
        <div style="width: 100%; padding: 20px;">
          <h3>Order Id: ${transactionId}</h3>
          <br />
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Product Name</th>
                <th style="text-align: left;">Quantity</th>
                <th style="text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${allProduct.map((item) => {
                return `<tr>
                    <td><img src="${item.pImage}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;" />${item.pName}</td>
                    <td>${item.quantitiy}</td>
                    <td>${item.pPrice}</td>
                  </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <div style="width: 100%; padding: 20px;">
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Address</th>
                <th style="text-align: left;">Phone</th>
                <th style="text-align: left;">Sub-total</th>
                <th style="text-align: left;">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${address}</td>
                <td>${phone}</td>
                <td>${amount}</td>
                <td>${paymentMethod}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>`;
  const mailOptions = {
    to: user.email,
    from: process.env.AUTH_EMAIL,
    subject: "Order Placed Successfully",
    html: htmlFile,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendUserOrderUpdatedEmail = async (
  user,
  allProduct,
  amount,
  transactionId,
  address,
  phone,
  paymentMethod,
  status
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const htmlFile = `
  <div style="width: 100%; background-color: #f2f2f2; padding: 50px 0;">
  <div style="width: 80%; margin: auto; background-color: #fff; padding: 50px 0;">
    <div style="width: 80%; margin: auto;">
      <div style="text-align: center;">
        <h2 style="color: #ff4d4d;">Order Updated with status ${status}</h2>
        <p style="color: #000;">Your order has been updated. Your order details are below:</p>
      </div>
      <div style="margin-top: 50px;">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background-color: #ff4d4d; color: #fff;">
          <h2>Order Details</h2>
        </div>
        <div style="width: 100%; padding: 20px;">
          <h3>Order Id: ${transactionId}</h3>
          <br />
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Product Name</th>
                <th style="text-align: left;">Quantity</th>
                <th style="text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${allProduct.map((item) => {
                return `<tr>
                    <td><img src="${item.pImage}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;" />${item.pName}</td>
                    <td>${item.quantitiy}</td>
                    <td>${item.pPrice}</td>
                  </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <div style="width: 100%; padding: 20px;">
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Address</th>
                <th style="text-align: left;">Phone</th>  
                <th style="text-align: left;">Sub-total</th>
                <th style="text-align: left;">Payment Method</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${address}</td>
                <td>${phone}</td> 
                <td>${amount}</td>
                <td>${paymentMethod}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>`;
  const mailOptions = {
    to: user.email,
    from: process.env.AUTH_EMAIL,
    subject: `Order Status: ${status}`,
    html: htmlFile,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendAdminEmail = async (
  customer,
  adminEmail,
  allProduct,
  amount,
  transactionId,
  address,
  phone
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // e.g., 'gmail'
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const htmlFile = `
  <div style="width: 100%; background-color: #f2f2f2; padding: 50px 0;">
  <div style="width: 80%; margin: auto; background-color: #fff; padding: 50px 0;">
    <div style="width: 80%; margin: auto;">
      <div style="text-align: center;">
        <h2 style="color: #ff4d4d;">New Order Placed</h2>
        <p style="color: #000;">New order has been placed by ${
          customer.name
        }. Order details are below:</p>
      </div>
      <div style="margin-top: 50px;">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background-color: #ff4d4d; color: #fff;">
          <h2>Order Details</h2>
        </div>
        <div style="width: 100%; padding: 20px;">
          <h3>Order Id: ${transactionId}</h3>
          <br />
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Product Name</th>
                <th style="text-align: left;">Quantity</th>
                <th style="text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${allProduct.map((item) => {
                return `<tr>
                    <td><img src="${item.pImage}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;" />${item.pName}</td>
                    <td>${item.quantitiy}</td>
                    <td>${item.pPrice}</td>
                  </tr>`;
              })}
            </tbody>
          </table>
        </div>
        <div style="width: 100%; padding: 20px;">
          <table style="width: 100%;">
            <thead>
              <tr>
                <th style="text-align: left;">Address</th>
                <th style="text-align: left;">Phone</th>
                <th style="text-align: left;">Sub-total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${address}</td>
                <td>${phone}</td>
                <td>${amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>`;
  const mailOptions = {
    to: adminEmail.email,
    from: process.env.AUTH_EMAIL,
    subject: "New Order Placed",
    html: htmlFile,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const ordersController = new Order();
module.exports = ordersController;
