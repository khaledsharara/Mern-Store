const express = require("express");
const router = express.Router();
const couponsController = require("../controller/coupons");

router.get("/get-all-coupons", couponsController.getAllCoupons);
router.post("/create-coupon", couponsController.createCoupon);
router.delete("/delete-coupon/:id", couponsController.deleteCoupon);

module.exports = router;
