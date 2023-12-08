const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartProducts = new Schema({
  cp_id: {
    type: Number,
    unique: true,
  },
  p_id: {
    type: Number,
    required: true,
    ref: "Products",
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const CartProducts = mongoose.model("CartProducts", cartProducts);
