const express = require("express");
const router = express.Router();
const contactUsController = require("../controller/contactUs");

router.post("/send-email", contactUsController.handleSendEmail);

module.exports = router;
