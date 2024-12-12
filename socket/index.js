exports.init = () => {
  global.io.on("connection", () => {
    console.log("connection started");
  });

  io.sockets.on("connection", function (socket) {
    socket.on("shopId", (data) => {
      socket.join(data);
      console.log("joindata", data);
    });
  });

  global.io.on("disconnect", () => {
    console.log("connection disconnected");
  });
};

exports.sendOrderId = (name, shopId, orderId) => {
  //for emit to all shop with orderId
  // global.io.emit(name, data);

  //for emit of orderId to particular shopid
  console.log("Received shopId:", shopId);
  console.log("Received orderId:", orderId);
  io.sockets.in(shopId).emit(name, shopId);
};
