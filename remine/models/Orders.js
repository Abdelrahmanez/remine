const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orders = new Schema({
    o_id: {
        type: Number,
        unique: true,
    },
    ordersProducts: {
        type: Array,
        required: true,
    },
    state: {
        type: char,
        required: true,
        // c = confirmed, d = delivered, r = rejected
    },
    userId: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    });


    const Orders = mongoose.model("User", users);
    module.exports = Orders;