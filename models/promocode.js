const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const promocode = new Schema({
    id: {
        type: Number,
        unique: true,
    },
    code: {
        type: String,
        required: false,
        unique: true,
        minlength: 3,
        maxlength: 30,
    },
    value: {
        type: Number,
        required: true,
    },
    isPercent: {
        type: Boolean,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    minCart: {
        required: false,
        type: Number,
        default: 0,
    },
    maxValue: {
        type: Number,
        default: 0,
    },
    });

    const Promocode = mongoose.model("Promocode", promocode);
    module.exports = Promocode;