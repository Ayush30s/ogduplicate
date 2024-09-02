const {Router} = require("express");
const userModel = require("../Models/user");
const gymModel = require("../Models/gym");

const staticRoute = Router();

staticRoute.get("/", (req,res) => {
    return res.render("frontpage");
})

staticRoute.get("/register-user", (req,res) => {
    return res.render("register");
})

staticRoute.get("/register-user/form", (req,res) => {
    return res.render("registerUser");
})

staticRoute.get("/register-owner/form", (req,res) => {
    return res.render("registerOwner");
})

staticRoute.get("/signin-form", (req,res) => {
    return res.render("signin");
})

staticRoute.get("/home", (req,res) => {
    return res.render("landing");
})

staticRoute.get("/editprofile", async(req,res) => {
    const {_id} = req.user;
    let data = await userModel.findById(_id);

    if(!data) {
        data = await gymModel.findById(_id);
    }

    return res.render("editform", {
        user: req.user,
        userData: data
    });
})

staticRoute.get("/edit-gym/:gymId", (req,res) => {
    const {gymId} = req.params;
    return res.render("gymEditForm", {
        gymId: gymId
    });
})


module.exports = staticRoute;
