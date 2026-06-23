const Product = require("../modules/Product");

const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const cursor = req.query.cursor;

    let query = {};

    if (category) {
      query.category = category;
    }

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const products = await Product.find(query)
      .sort({ _id: -1 })
      .limit(limit);

    const nextCursor =
      products.length > 0
        ? products[products.length - 1]._id
        : null;

    res.json({
      success: true,
      products,
      nextCursor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getProducts };