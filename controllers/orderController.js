const { sendOrderId } = require("../socket");
const Order = require("../models/orderModel");

exports.getOrders = async (req, res) => {
  let orderId = req.params.id;
  let shopId = req.params.shopID;

  // sendOrderId('sendOrderId', orderId)
  // res.status(200).json({
  //   status: "success",
  //   orderId
  // });

  if (shopId) {
    sendOrderId("sendOrderId", shopId, orderId);
    res.status(200).json({
      status: "success",
      shopId: shopId,
      orderId: orderId,
      message: "Order ID sent to the shop",
    });
  } else {
    res.status(404).json({
      status: "failed",
      shopId: shopId,
      orderId: orderId,
      message: "Shop ID not found",
    });
  }
};

exports.createOrder = async (req, res) => {
  const shopId = req.params.shopId;
  const orderDetails = await Order.create(req.body);

  if (!shopId || !orderDetails) {
    return res.status(400).send("Invalid request");
  }

  res.status(200).json({
    status: "success",
    message: `Order for shop ${shopId} has been created with details`,
    data: orderDetails,
  });
};
