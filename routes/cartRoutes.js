const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .get("/getAllCartCategories", cartController.getAllCartCategories)
  .post("/createCartItem/:categoryId", cartController.addItemToCart)
  .delete("/deletecartItem/:id", cartController.deleteCartCategory);

module.exports = router;
