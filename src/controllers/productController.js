const pool = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const cursor = req.query.cursor;

    let query = "";
    let values = [];

    // First page
    if (!cursor) {
      if (category) {
        query = `
          SELECT *
          FROM products
          WHERE category = $1
          ORDER BY created_at DESC, id DESC
          LIMIT $2
        `;

        values = [category, limit];
      } else {
        query = `
          SELECT *
          FROM products
          ORDER BY created_at DESC, id DESC
          LIMIT $1
        `;

        values = [limit];
      }
    }

    // Next pages
    else {
      const [cursorCreatedAt, cursorId] = cursor.split("_");

      if (category) {
        query = `
          SELECT *
          FROM products
          WHERE category = $1
          AND (created_at, id) < ($2, $3)
          ORDER BY created_at DESC, id DESC
          LIMIT $4
        `;

        values = [
          category,
          cursorCreatedAt,
          Number(cursorId),
          limit,
        ];
      } else {
        query = `
          SELECT *
          FROM products
          WHERE (created_at, id) < ($1, $2)
          ORDER BY created_at DESC, id DESC
          LIMIT $3
        `;

        values = [
          cursorCreatedAt,
          Number(cursorId),
          limit,
        ];
      }
    }

    const result = await pool.query(query, values);

    const products = result.rows;

    let nextCursor = null;

    if (products.length > 0) {
      const lastProduct = products[products.length - 1];

      nextCursor =
        `${lastProduct.created_at.toISOString()}_${lastProduct.id}`;
    }

    res.status(200).json({
      success: true,
      count: products.length,
      nextCursor,
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getProducts,
};