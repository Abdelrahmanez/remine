const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cart = new Schema({
  c_id: {
    type: Number,
    unique: true,
  },
  cartProducts: {
    type: Array,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  productId: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  });

const Cart = mongoose.model("User", users);
module.exports = Cart;
