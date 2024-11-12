require('dotenv').config();

const ownerRoute = require("./Routes/owner");
const staticRoute = require("./Routes/staticroute");
const { homeRoute } = require("./Routes/home");
const followRoute = require("./Routes/follow");
const { blogRouter } = require("./Routes/blog");
const { authenticateUser } = require("./Middleware/authentication");
const userModel = require("./Models/user");
const RequestModel = require("./Models/request");

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "*", // or specify your frontend URL
        methods: ["GET", "POST"]
    }
});

io.on("connection" , (socket) => {
    socket.on("aiMessage", (data) => {
        console.log(data);
        socket.emit("serverMessage", "This Service is temporarly Off");
    })    
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected Successfully"))
    .catch((err) => console.log("err :", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", (req, res) => {
    return res.render("frontpage");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve("./Public")));
app.use(express.static(path.resolve("./Public/images")));
app.use(authenticateUser('token'));

app.get("/bloglike", async(req,res) => {
    if(!req.user) {
        return res.redirect("/app/signin-form");
    }
    
    const Likedblogs = await userModel.findById(req.user._id).populate("Likedblogs");
    return res.render("likedBlogs", {
        Likedblogs: Likedblogs,
        user: req.user
    });
})

app.get("/blogsave", async(req,res) => {
    if(!req.user) {
        return res.redirect("/app/signin-form");
    }

    const Savedblogs = await userModel.findById(req.user._id).populate("Savedblogs");
    return res.render("savedblogs", {
        Savedblogs: Savedblogs,
        user: req.user
    });
})

app.use("/app", staticRoute);
app.use("/register", ownerRoute);
app.use("/home", (req, res, next) => {
    if (!req.user) {
        return res.redirect("/app");
    }
    next();
}, homeRoute);
app.use("/request", followRoute);

// Only allow users to use blog service
app.use("/blog", async (req, res, next) => {
    if (!req.user) {
        return res.redirect("/app/signin-form");
    }

    const userData = await userModel.findOne({ email: req.user.email });

    if (!userData) {
        return res.send("Owner Id can't be used to create blog, use a user Id.");
    }

    next();
}, blogRouter);

server.listen(PORT, () => console.log("Server running at PORT:", PORT));
