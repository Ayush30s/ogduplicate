const mongoose = require("mongoose")

const ShiftSchmea = mongoose.Schema({
    sex: {
        type: String,
        enum: ["Male", "Female"]
    }, 
    limit: {
        type: Number,
        default: 10
    },
    starttime: {
        type: String
    },
    endtime: {
        type: String
    },
    joinedby: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:  "userModel"
    }]
}, {timestamps : true});

const ShiftModel = mongoose.model("ShiftModel", ShiftSchmea);

module.exports = ShiftModel;