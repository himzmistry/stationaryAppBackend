const axios = require("axios");
const Address = require("../models/addressModel");
const factory = require("../utils/handlerFactory");

exports.getAllAddress = async (req, res, next) => {
  const address = await Address.find();

  res.status(200).json({
    status: "success",
    results: address.length,
    data: address,
  });
};

// Example function to fetch city and state
exports.getLocationByPincode = async (req, res, next) => {
  const { pincode } = req.params;

  if (!pincode) {
    return res.status(400).json({
      status: "fail",
      message: "Pincode is required",
    });
  }

  try {
    const location = await getCityAndStateFromPincode(pincode);
    console.log("location", location);

    res.status(200).json({
      status: "success",
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

async function getCityAndStateFromPincode(pincode) {
  // const url = `https://api.postalpincode.in/pincode/${pincode}`;

  try {
    const response = await axios.get(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    const data = response.data[0];

    if (data.Status === "Success") {
      const city = data.PostOffice[0].District;
      const state = data.PostOffice[0].State;
      return { city, state };
    } else {
      return { error: "Invalid PIN code or no data available." };
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return { error: "Could not fetch city and state. Please try again later." };
  }
}

exports.createAddress = factory.createOne(Address);
exports.updateAddress = factory.updateOne(Address);
exports.deleteAddress = factory.deleteOne(Address);
