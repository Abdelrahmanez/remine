const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const address = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
});

const Address = mongoose.model("Address", address);