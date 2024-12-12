const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .get(
    "/:shopID/getOrderId/:id",
    authController.protect,
    orderController.getOrders
  )
  .post(
    "/createOrder/:shopId",
    authController.protect,
    orderController.createOrder
  );

module.exports = router;
