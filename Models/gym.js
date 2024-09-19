const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const gymSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    contactnumber: {
        type: Number,
        required: true,
    },
    gymname: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0, // For average rating
    },
    ratedby: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
        rating: { type: Number, required: true, default: 0 },
        ratedAt: { type: Date, default: Date.now }
    }],
    profileImage: {
        type: String,
        default: "/images/gym.jpg",
    },
    usertype: {
        type: String,
        default: "OWNER",
        enum: ["USER", "OWNER"],
    },
    joinedby: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "userModel" },
            joinedAt: { type: Date, default: Date.now },
        },
    ],
    monthlyCharge: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "Add a bio",
    },
    salt: {
        type: String,
    },
    shifts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShiftModel",
        },
    ],
    plans: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "planModel"
    }
}, { timestamps: true });

// Hashing the password for security purposes
gymSchema.pre("save", function (next) {
    const user = this;
    if (!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex"); // Corrected string format
    const hashPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashPassword;

    next();
});

const gymModel = mongoose.model("gymModel", gymSchema);

module.exports = gymModel;
