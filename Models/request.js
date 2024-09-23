const mongoose = require("mongoose")

const requestSchema = mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
    },
    gymId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "gymModel",
    },
    status: {
        type: String,
        default: "pending"
    }
}, {timestamps : true});

const RequestModel = mongoose.model("RequestModel", requestSchema);

module.exports = RequestModel;