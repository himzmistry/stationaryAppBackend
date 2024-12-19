const Category = require("../models/categoryModel");
const Cart = require("../models/cartModel");
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

exports.addItemToCart = async (req, res) => {
  try {
    const cartItems = req.body.cartItems;
    // Ensure that cartItems array is present
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "fail",
        message: "No items in cart",
      });
    }

    // Step 1: Find the category by the ID passed in req.params.id
    const foundCategory = await Category.findById(req.params.categoryId);

    if (!foundCategory) {
      return res.status(404).json({
        statusCode: 404,
        status: "fail",
        message: "Category not found",
      });
    }

    // Step 2: Loop through the cartItems array and validate each item
    for (let item of cartItems) {
      // Step 2.1: Find the product in the category's items by matching the product ID
      const foundProduct = foundCategory.categoryItems.find(
        (p) => p._id.toString() === item.item
      );

      if (!foundProduct) {
        return res.status(404).json({
          statusCode: 404,
          status: "fail",
          message: "Product not found in category",
        });
      }

      // Step 2.2: Create the product object to be added to the cart
      const product = {
        item: foundProduct._id,
        quantity: item.quantity,
        price: foundProduct.price * item.quantity,
      };

      // Before attempting to use req.user._id, ensure it's available
      const userId = req.body.userId;
      if (!userId) {
        return res.status(401).json({
          statusCode: 401,
          status: "fail",
          message: "User is not authenticated",
        });
      }

      // Step 3: Find or create a cart for the user
      let cart = await Cart.findOne({ userId: userId });

      if (!cart) {
        cart = new Cart({
          userId: userId,
          cartItems: [product], // Initialize cartItems with the first product
          totalPrice: product.price,
        });
      } else {
        // Step 4: Push the new product to the cart and update totalPrice
        cart.cartItems.push(product);
        cart.totalPrice += product.price;
      }

      // Step 5: Save the cart
      await cart.save();

      // Return success response after adding all items to the cart
      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Items added to cart successfully",
        data: cart,
      });
    }
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "fail",
      message: "Internal server error",
    });
  }
};
