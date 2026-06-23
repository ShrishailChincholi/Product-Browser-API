const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Product = require("../modules/Product");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const categories = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Furniture",
];

async function seed() {
  const products = [];

  for (let i = 0; i < 200000; i++) {
    products.push({
      name: faker.commerce.productName(),
      category:
        categories[Math.floor(Math.random() * categories.length)],
      price: Number(faker.commerce.price()),
      createdAt: faker.date.recent(),
      updatedAt: new Date(),
    });
  }

  await Product.insertMany(products);

  console.log("200000 Products Inserted");
  process.exit();
}

seed();