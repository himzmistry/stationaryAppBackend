const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  streetAddress1: { type: String, required: [true] },
  streetAddress2: { type: String, required: [true] },
  landmark: { type: String },
  pincode: { type: Number, required: [true] },
  city: { type: String, required: [true] },
  state: { type: String, required: [true] },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
