const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const couponsSchema = new mongoose.Schema(
  {
    Code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["fixed", "percent", "buyGet", "freeShipping"],
    },
    value: {
      type: Number,
    },
    buyGetValue: {
      type: [Number],
    },
    allowedProducts: [
      {
        type: ObjectId,
        ref: "products",
      },
    ],
    minimumTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const couponsModel = mongoose.model("coupons", couponsSchema);
module.exports = couponsModel;
