const couponsModel = require("../models/coupons");
const mongoose = require("mongoose");

// TODO - Check comments below

class Coupon {
  async getAllCoupons(req, res) {
    try {
      // Fetch all coupons with populated allowedProducts field
      let coupons = await couponsModel.find({}).sort({ _id: -1 });

      // Respond with the coupons if they exist
      if (coupons) {
        return res.json({ coupons });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async createCoupon(req, res) {
    try {
      const { Code, type, value, buyGetValue, allowedProducts, minimumTotal } =
        req.body;

      // Convert allowedProducts to an array of ObjectId
      let allowedProductsId = [];
      if (allowedProducts && Array.isArray(allowedProducts)) {
        allowedProductsId = allowedProducts.map((productId) =>
          mongoose.Types.ObjectId(productId)
        );
      }

      console.log("id", allowedProductsId);

      // Create a new coupon instance
      const newCoupon = new couponsModel({
        Code,
        type,
        value,
        buyGetValue,
        allowedProducts: allowedProductsId,
        minimumTotal,
      });

      // Save the new coupon to the database
      const savedCoupon = await newCoupon.save();

      // Respond with the saved coupon
      res.status(201).json({ coupon: savedCoupon });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deleteCoupon(req, res) {
    try {
      const couponId = req.params.id;

      // Check if the provided ID is valid
      if (!mongoose.Types.ObjectId.isValid(couponId)) {
        return res.status(400).json({ error: "Invalid coupon ID" });
      }

      // Attempt to find and delete the coupon
      const deletedCoupon = await couponsModel.findByIdAndDelete(couponId);

      // If the coupon was not found, respond with an error
      if (!deletedCoupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }

      // Respond with the deleted coupon
      res.json({
        message: "Coupon deleted successfully",
        coupon: deletedCoupon,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

const couponsController = new Coupon();
module.exports = couponsController;
