const { Router } = require("express");
const multer = require('multer');
const gymModel = require("../Models/gym");
const path = require("path");
const userModel = require("../Models/user");
const { createHmac } = require("crypto");
const { createToken } = require("../services/auth");

const ownerRoute = Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve('./public/uploads')); // Save files in the public/uploads directory
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename); // Name files with a timestamp to avoid conflicts
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Register as a gym owner
ownerRoute.post("/owner", upload.single('profileImage'), async (req, res) => {
    try {
        const { fullname, email, password, location, rating, gymname, description, gender, contactnumber } = req.body;

        // Ensure all fields are filled
        if (!fullname || !email || !password || !location || !gymname || !description || !gender || !contactnumber) {
            return res.status(400).send("All fields are required");
        }

        // Handle the uploaded file
        const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Check if the email is already registered in the user model
        const checkEmailInUserModel = await userModel.findOne({ email: email });
        if (checkEmailInUserModel) {
            return res.render("frontpage", {
                msg: "This Email is already registered.",
            });
        }

        // Create a new gym owner entry in the gym model
        const ownerdata = await gymModel.create({
            fullname: fullname,
            email: email,
            password: password,
            location: location,
            rating: rating,
            gymname: gymname,
            description: description,
            gender: gender,
            contactnumber: contactnumber,
            profileImage: profileImagePath // Save the uploaded file path
        });

        console.log(ownerdata);

        return res.redirect("/app/signin-form");
    } catch (error) {
        console.error("Error registering owner:", error);
        return res.status(500).send("Internal Server Error");
    }
});

ownerRoute.post("/user", upload.single("profileImage"), async (req, res) => {
    try {
        const { fullname, email, password, gender, contactnumber } = req.body;
        console.log(fullname, email, password, gender, contactnumber);

        // Ensure all fields are filled
        if (!fullname || !email || !password || !gender || !contactnumber) {
            return res.status(400).send("All fields are required");
        }

        // Handle the uploaded file
        const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

        // Check if the email is already registered in the gym model
        const checkEmailInGymModel = await gymModel.findOne({ email: email });
        if (checkEmailInGymModel) {
            return res.render("frontpage", {
                msg: "This Email is already registered.",
            });
        }

        // Create a new user entry in the user model
        await userModel.create({
            fullname: fullname,
            email: email,
            password: password,
            gender: gender,
            contactnumber: contactnumber,
            profileImage: profileImagePath // Save the uploaded file path
        });

        return res.redirect("/app/signin-form");
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Sign in route
ownerRoute.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await gymModel.findOne({ email });

        if (!user) {
            user = await userModel.findOne({ email });
        }

        if (!user) {
            return res.status(404).render("signin", {
                msg: "Wrong Email or Password"
            });
        }

        let salt = user?.salt;
        let hashPassword = user.password;

        const createinputPassswordHash = createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (createinputPassswordHash !== hashPassword) {
            return res.status(400).send("Wrong Email or Password");
        }

        const token = createToken(user);

        return res.cookie("token", token).redirect("/home");
    } catch (error) {
        console.error("Error during sign in:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Sign out route
ownerRoute.get("/signout", async (req, res) => {
    return res.clearCookie('token').redirect("/app");
});

module.exports = ownerRoute;
