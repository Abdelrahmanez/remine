const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const size = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  size: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 30,
  },
  p_id: {
    type: Number,
    required: true,
    ref: "Products",
  },
});

const Size = mongoose.model("Size", size);
