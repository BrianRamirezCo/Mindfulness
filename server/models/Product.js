const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    title: String,
    author: String,
    description: String,
    category: String,
    type: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    ebookFile: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
