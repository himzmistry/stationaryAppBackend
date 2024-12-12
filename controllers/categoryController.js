const Category = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");
const cron = require("node-cron");

exports.getAllCategories = async (req, res, next) => {
  const category = await Category.find();
  res.status(200).json({
    status: "success",
    results: category.length,
    data: category,
  });
};

exports.createCategory = factory.createOne(Category);

const updateQuantities = async () => {
  try {
    // Assuming you want to reset quantity to 50; adjust if needed
    await Category.updateMany({}, { inventory: 50 });
    console.log("Quantities have been updated to 50");
  } catch (error) {
    console.error("Error updating quantities:", error);
  }
};

// Schedule the task to run every 24 hours at 5am
cron.schedule("0 5 * * *", async () => {
  console.log("Running quantity update job...");
  await updateQuantities();
  showQuantities();
});

// Example function to show current quantities (for testing purposes)
const showQuantities = async () => {
  try {
    const items = await Category.find({}); // Fetch all documents

    if (items.length === 0) {
      console.log("No items found.");
      return;
    }

    // Check and log each item
    items.forEach((item) => {
      console.log(`Inventory: ${item.inventory}`);
    });
  } catch (error) {
    console.error("Error fetching quantities:", error);
  }
};
