const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  itemId: { type: Number },
  quantity: { type: Number },
  cooking_instruction: { type: String },
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
    unique: true,
  },
  order_type: { type: String, enum: ["DineIn", "TakeAway", "Delivery"] },
  items: [itemSchema],
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
