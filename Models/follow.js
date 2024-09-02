const mongoose = require("mongoose");

const followSchema = mongoose.Schema({
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel" 
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel" 
    }],
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {timestamps: true});

const followModel = mongoose.model("followModel", followSchema);

module.exports = followModel;
