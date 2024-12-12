const express = require("express");
const addressController = require("../controllers/addressController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .get("/getAllAddress", addressController.getAllAddress)
  .get(
    "/:pincode",
    authController.protect,
    addressController.getLocationByPincode
  )
  .post("/createAddress", addressController.createAddress)
  .put("/updateAddress/:id", addressController.updateAddress)
  .delete("/deleteAddress/:id", addressController.deleteAddress);

module.exports = router;
