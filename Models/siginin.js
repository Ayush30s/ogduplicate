const { Schema, model } = require("mongoose");

const signSchema = new Schema({
    email: {
        type: String
    }
}, {timestamps : true});

const signModel = model('signModel', signSchema);

module.exports = signModel;
