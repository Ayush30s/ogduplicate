const { Schema, model } = require("mongoose");

const likeSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref : 'blogModel',
        required: true
    },
    likedBy : [{
        type: Schema.Types.ObjectId,
        ref : 'userModel'
    }]
}, {timestamps : true});

const likeModel = model('likeModel', likeSchema);

module.exports = likeModel;
