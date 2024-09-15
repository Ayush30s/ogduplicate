const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    rating: {
        type: Number,
        default: 0
    },
    ratedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel" 
    }
}, {timestamps: true});

const ratingModel = mongoose.model("ratingModel", ratingSchema);

module.exports = ratingModel;
