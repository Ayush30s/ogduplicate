const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const userSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    contactnumber: {
        type: Number,
        required: true
    },
    profileImage: {
        type: String,
        default : "/images/profile.jpg"
    },
    joinedgym : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "gymModel"
    }],
    followData : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "followModel"
    },
    usertype: {
        type: String,
        default: "USER",
        enum : ["OWNER", "USER"]
    },
    bio: {
        type: String,
        default: "Add a bio"
    },
    salt: {
        type: String,
    }
}, {timestamps : true});



//Hashing the password for security purpose
userSchema.pre("save", function(next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashPassword;
    
    next();
})

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;