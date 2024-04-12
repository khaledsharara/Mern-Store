const express = require("express");
const transactionController = require("../controller/callback");

const router = express.Router();

router.post(
  "/transaction-processed-callback",
  transactionController.handleProcessedCallback
);
router.get(
  "/transaction-response-callback",
  transactionController.handleResponseCallback
);

module.exports = router;
