const mongoose = require("mongoose");

// Define the physical attributes schema
const PhySchema = new mongoose.Schema({
    height: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true
    },
    fitnessGoal: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    availableEquipment: {
        type: String,
        required: true
    },
    workoutFrequency: {
        type: String,
        required: true
    },
    injuriesLimitations: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Register the PhyModel
const PhyModel = mongoose.model("PhyModel", PhySchema);

module.exports = PhyModel;
