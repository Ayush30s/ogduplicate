// const { Router } = require("express");
// const multer = require('multer');
// const gymModel = require("../Models/gym");
// const path = require("path");
// const userModel = require("../Models/user");
// const { createHmac } = require("crypto");
// const { createToken } = require("../services/auth");
// const PhyModel = require("../Models/userphy");
// const cloudinary = require("cloudinary").v2;

// const fun = async(path) => {
//     cloudinary.config({ 
//         cloud_name: 'dzblab9we', 
//         api_key: '575212773332514', 
//         api_secret: 'ghj2avDgbHGv81YNAzo95uvpnHg'
//     });
    
//     const uploadResult = await cloudinary.uploader.upload(path);
//     return uploadResult;
// }

// const ownerRoute = Router();

// // Set up multer storage configuration
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve('./public/uploads')); // Save files in the public/uploads directory
//     },
//     filename: function (req, file, cb) {
//         const filename = `${Date.now()}-${file.originalname}`;
//         cb(null, filename); // Name files with a timestamp to avoid conflicts
//     }
// });

// // Initialize multer with the storage configuration
// const upload = multer({ storage: storage });

// // Register as a gym owner
// ownerRoute.post("/owner", upload.single('profileImage'), async (req, res) => {
//     try {
//         const { fullname, email, password, location, rating, gymname, description, gender, contactnumber } = req.body;

//         // Ensure all fields are filled
//         if (!fullname || !email || !password || !location || !gymname || !description || !gender || !contactnumber) {
//             return res.status(400).send("All fields are required");
//         }

//         // Handle the uploaded file
//         const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

//         // Check if the email is already registered in the user model
//         const checkEmailInUserModel = await userModel.findOne({ email: email });
//         if (checkEmailInUserModel) {
//             return res.render("frontpage", {
//                 msg: "This Email is already registered.",
//             });
//         }

//         // Upload the image to Cloudinary and get the URL
//         let cloudImageURL = null;
//         if (profileImagePath) {
//             try {
//                 // Await the Cloudinary upload process
//                 const uploadResponse = await fun("./Public" + profileImagePath); 
//                 cloudImageURL = uploadResponse.secure_url;  // Get the URL after the upload completes
//             } catch (error) {
//                 console.error("Error uploading image to Cloudinary:", error);
//                 return res.status(500).send("Error uploading image to Cloudinary.");
//             }
//         }

//         // Create a new gym owner entry in the gym model with the Cloudinary URL
//         const newGymOwner = await gymModel.create({
//             fullname: fullname,
//             email: email,
//             password: password,
//             location: location,
//             rating: rating,
//             gymname: gymname,
//             description: description,
//             gender: gender,
//             contactnumber: contactnumber,
//             profileImage: cloudImageURL // Save the Cloudinary URL
//         });

//         await newGymOwner.save();
        
//         return res.redirect("/app/signin-form");
//     } catch (error) {
//         console.log("Error:", error);
//         return res.status(500).send("Internal Server Error");
//     }
// });


// ownerRoute.post("/user", upload.single("profileImage"), async (req, res) => {
//     try {
//         const { fullname, email, password, gender, contactnumber } = req.body;

//         // Ensure all fields are filled
//         if (!fullname || !email || !password || !gender || !contactnumber) {
//             return res.status(400).send("All fields are required");
//         }

//         // Handle the uploaded file
//         const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null;

//         // Upload the image to Cloudinary and get the URL
//         let cloudImageURL = null;
//         if (profileImagePath) {
//             try {
//                 // Await the Cloudinary upload process
//                 const uploadResponse = await fun("./Public" + profileImagePath); 
//                 cloudImageURL = uploadResponse.secure_url;  // Get the URL after the upload completes
//             } catch (error) {
//                 console.error("Error uploading image to Cloudinary:", error);
//                 return res.status(500).send("Error uploading image to Cloudinary.");
//             }
//         }

//         // Check if the email is already registered in the gym model
//         const checkEmailInGymModel = await gymModel.findOne({ email: email });
//         if (checkEmailInGymModel) {
//             return res.render("frontpage", {
//                 msg: "This Email is already registered.",
//             });
//         }

//         // Create a new user entry in the user model
//         const newday = await userModel.create({
//             fullname: fullname,
//             email: email,
//             password: password,
//             gender: gender,
//             contactnumber: contactnumber,
//             profileImage: cloudImageURL // Save the uploaded file path
//         });
//         console.log("data : " , newday);

//         return res.redirect("/app/signin-form");
//     } catch (error) {
//         console.error("Error registering user:", error);
//         return res.status(500).send("Internal Server Error hai");
//     }
// });

// // Sign in route
// ownerRoute.post("/signin", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         let user = await gymModel.findOne({ email });

//         if (!user) {
//             user = await userModel.findOne({ email });
//         }

//         if (!user) {
//             return res.status(404).render("signin", {
//                 msg: "Wrong Email or Password"
//             });
//         }

//         let salt = user?.salt;
//         let hashPassword = user.password;

//         const createinputPassswordHash = createHmac("sha256", salt)
//             .update(password)
//             .digest("hex");

//         if (createinputPassswordHash !== hashPassword) {
//             return res.status(400).send("Wrong Email or Password");
//         }

//         const token = createToken(user);

//         return res.cookie("token", token).redirect("/home");
//     } catch (error) {
//         console.log(error);
//         console.error("Error during sign in:", error);
//         return res.status(500).send("Internal Server Error hai");
//     }
// });

// // Sign out route
// ownerRoute.get("/signout", async (req, res) => {
//     return res.clearCookie('token').redirect("/app");
// });

// ownerRoute.post("/addmoredetails", async (req, res) => {
//     try {
//         const { height, weight, fitnessGoal, experienceLevel, availableEquipment, workoutFrequency, injuriesLimitations } = req.body;

//         // Create a new document in the PhyModel collection
//         const details = await PhyModel.create({
//             height,
//             weight,
//             fitnessGoal,
//             experienceLevel,
//             availableEquipment,
//             workoutFrequency,
//             injuriesLimitations
//         });

//         // Find the user by ID and update their phy field with the ID of the created details
//         await userModel.findByIdAndUpdate(
//             req.user._id,
//             { phy: details._id },  // Update the phy field with the new PhyModel ID
//             { new: true }
//         ).populate("phy");  // Populate the phy field to bring in the related PhyModel document

//         return res.redirect(`/home/profile/${req.user._id}/workoutplan`);
//     } catch (error) {
//         console.log(error);
//         console.error("Error adding more details:", error);
//         return res.status(500).send("Server error hai");
//     }
// });

// module.exports = ownerRoute;
const { Router } = require("express");
const multer = require('multer');
const gymModel = require("../Models/gym");
const userModel = require("../Models/user");
const PhyModel = require("../Models/userphy");
const { createHmac } = require("crypto");
const { createToken } = require("../services/auth");
const cloudinary = require("cloudinary").v2;

const ownerRoute = Router();

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer storage (memory storage)
const storage = multer.memoryStorage();  // Store the file in memory
const upload = multer({ storage: storage });  // Initialize multer with memory storage

// Utility function to upload image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "profileImages" },  // Optionally specify a folder in Cloudinary
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);  // Resolve with Cloudinary URL
                }
            }
        );
        stream.end(fileBuffer);  // Pass the file buffer to the upload stream
    });
};

// Register as a gym owner
ownerRoute.post("/owner", upload.single('profileImage'), async (req, res) => {
    try {
        const { fullname, email, password, location, rating, gymname, description, gender, contactnumber } = req.body;

        // Ensure all fields are filled
        if (!fullname || !email || !password || !location || !gymname || !description || !gender || !contactnumber) {
            return res.status(400).send("All fields are required");
        }

        let cloudImageURL = null;

        // If a file is uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                cloudImageURL = await uploadToCloudinary(req.file.buffer);  // Upload image buffer
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                return res.status(500).send("Error uploading image to Cloudinary.");
            }
        }

        // Check if the email is already registered in the user model
        const checkEmailInUserModel = await userModel.findOne({ email: email });
        if (checkEmailInUserModel) {
            return res.render("frontpage", { msg: "This Email is already registered." });
        }

        // Create a new gym owner entry in the gym model with the Cloudinary URL
        const newGymOwner = await gymModel.create({
            fullname,
            email,
            password,
            location,
            rating,
            gymname,
            description,
            gender,
            contactnumber,
            profileImage: cloudImageURL // Save the Cloudinary URL
        });

        return res.redirect("/app/signin-form");
    } catch (error) {
        console.log("Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Register as a user
ownerRoute.post("/user", upload.single("profileImage"), async (req, res) => {
    try {
        const { fullname, email, password, gender, contactnumber } = req.body;

        // Ensure all fields are filled
        if (!fullname || !email || !password || !gender || !contactnumber) {
            return res.status(400).send("All fields are required");
        }

        let cloudImageURL = null;

        // If a file is uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                cloudImageURL = await uploadToCloudinary(req.file.buffer);  // Upload image buffer
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                return res.status(500).send("Error uploading image to Cloudinary.");
            }
        }

        // Check if the email is already registered in the gym model
        const checkEmailInGymModel = await gymModel.findOne({ email: email });
        if (checkEmailInGymModel) {
            return res.render("frontpage", { msg: "This Email is already registered." });
        }

        // Create a new user entry in the user model
        const newUser = await userModel.create({
            fullname,
            email,
            password,
            gender,
            contactnumber,
            profileImage: cloudImageURL // Save the Cloudinary URL
        });

        return res.redirect("/app/signin-form");
    } catch (error) {
        return res.render("frontpage", { msg: "This Email is already registered." });
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
            return res.status(404).render("signin", { msg: "Wrong Email or Password" });
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
        console.log(error);
        return res.status(500).send("Internal Server Error hai");
    }
});

// Sign out route
ownerRoute.get("/signout", async (req, res) => {
    return res.clearCookie('token').redirect("/app");
});

// Add more details
ownerRoute.post("/addmoredetails", async (req, res) => {
    try {
        const { height, weight, fitnessGoal, experienceLevel, availableEquipment, workoutFrequency, injuriesLimitations } = req.body;

        const details = await PhyModel.create({
            height,
            weight,
            fitnessGoal,
            experienceLevel,
            availableEquipment,
            workoutFrequency,
            injuriesLimitations
        });

        await userModel.findByIdAndUpdate(
            req.user._id,
            { phy: details._id },
            { new: true }
        ).populate("phy");

        return res.redirect(`/home/profile/${req.user._id}/workoutplan`);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Server error hai");
    }
});

module.exports = ownerRoute;
