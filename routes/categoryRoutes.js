const express = require("express");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .get(
    "/allCategories",
    authController.protect,
    categoryController.getAllCategories
  )
  .post(
    "/createCategory",
    authController.protect,
    categoryController.createCategory
  );

module.exports = router;
