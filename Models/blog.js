const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        ref : 'userModel'
    },
    coverImage : {
        type: String
    },
}, {timestamps : true});

const blogModel = model('blogModel', blogSchema);

module.exports = {
    blogModel
};