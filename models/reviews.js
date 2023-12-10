const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviews = new Schema({
    p_id: {
        type: Number,
        required: [true, "p_id is required"],
    },
    u_id: {
        type: Number,
        required: [true, "u_id is required"],
    },
    rating: {
        type: Number,
        required: [true, "rating is required"],
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: [true, "review is required"],
        minlength: 3,
        maxlength: 300,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    });

const Reviews = mongoose.model("reviews", reviews);
module.exports = Reviews;