const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    joinedby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    }],
    price: {
        type: Number,
        required: true
    },
    timeperiod: {
        type: Number,
        required: true
    }
}, {timestamps: true})