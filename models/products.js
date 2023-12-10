const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const products = new Schema({
  p_id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: 3,
    maxlength: 30,
  },
  size: {
    type: String,
    maxlength: 30,
    required: [true, "size is required"],
  },
  price: {
    type: Number,
    required: [true, "price is required"],
    min: 0,
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
    min: 0,
  },
  description: {
    type: String,
    required: [true, "description is required"],
    minlength: 3,
    maxlength: 300,
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
  category: {
    type: String,
    required: [true, "category is required"],
  },
  subCategory: {
    type: String,
    required: [true, "subCategory is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  reviews: {
    type: Array,
    default: [],
  },
  });

const Products = mongoose.model("Products", products);
module.exports = Products;
