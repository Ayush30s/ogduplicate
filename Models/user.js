const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

// Define the user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
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
        default: "/images/profile.jpg"
    },
    joinedgym: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "gymModel"
    }],
    followData: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "followModel"
    },
    phy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PhyModel"  // Ensure this matches the name used to register the model
    },
    usertype: {
        type: String,
        default: "USER",
        enum: ["OWNER", "USER"]
    },
    bio: {
        type: String,
        default: "Bio..."
    },
    Likedblogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogModel"
    }],
    Savedblogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "blogModel"
    }],
    salt: {
        type: String,
    }
}, { timestamps: true });

// Hashing the password for security purposes
userSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");  // Ensure to convert to hex
    const hashPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashPassword;

    next();
});

// Register the userModel
const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;
