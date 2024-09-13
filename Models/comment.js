const { Schema, model } = require("mongoose");

const commentSchema = new Schema ({
    content : {
        type: String,
        required: true,
        default: "Nice"
    },
    blogId : {
        type: Schema.Types.ObjectId,
        ref : 'blogModel'
    },
    createdBy : {
        type: Schema.Types.ObjectId,
        ref : 'userModel'
    }
}, { timestamps : true });

const commentModel = model('commentModel', commentSchema);

module.exports = commentModel;
