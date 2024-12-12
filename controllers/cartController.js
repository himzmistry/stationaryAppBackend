const Cart = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");

exports.getAllCartCategories = async (req, res, next) => {
  const cartCategory = await Cart.find();
  res.status(200).json({
    status: "success",
    results: cartCategory.length,
    data: cartCategory,
  });
};

exports.createCartCategory = factory.createOne(Cart);
exports.deleteCartCategory = factory.deleteOne(Cart);