const { Schema, model } = require("mongoose");

const saveSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref : 'blogModel',
        required: true
    },
    savedby : [{
        type: Schema.Types.ObjectId,
        ref : 'userModel'
    }]
}, {timestamps : true});

const saveModel = model('saveModel', saveSchema);

module.exports = saveModel;
