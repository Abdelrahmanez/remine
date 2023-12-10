const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: 3,
    maxlength: 30,
  },
  userName: {
    type: String,
    required: [true, "User name is required"],
    minlength: 3,
    maxlength: 30,
    unique: [true, "The User name is already taken"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: 3,
    maxlength: 30,
    unique: [true, "Email already exists"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  cart: {
    type: Array,
    default: [],
  },
  orders: {
    type: Array,
    default: [],
  },
  addresses: {
    type: Array,
    default: [],
  },
  favorites: {
    type: Array,
    default: [],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: [true, "Phone number already exists"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Users = mongoose.model("User", users);
module.exports = Users;
