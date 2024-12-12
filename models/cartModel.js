const mongoose = require("mongoose");

const itemCartSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  price: { type: Number },
  image: { type: String, default: "default.jpg" },
});

const cartSchema = new mongoose.Schema({
  categoryName: { type: String },
  itemId: { type: Number },
  categoryItems: [itemCartSchema],
  inventory: { type: Number, default: 20 },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
