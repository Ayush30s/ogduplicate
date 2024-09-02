const express = require("express");
const mongoose = require("mongoose");
const ownerRoute = require("./Routes/owner");
const staticRoute = require("./Routes/staticroute");
const { homeRoute } = require("./Routes/home")
const followRoute = require("./Routes/follow")
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
const {authenticateUser} = require("./Middleware/authentication");


const app = express();
const PORT = 7000;

const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

mongoose.connect("mongodb://127.0.0.1:27017/Gym")
    .then(() => console.log("MonogDB connected Successfully"))
    .catch((err) => console.log("err :", err))


app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle user joining their specific room
    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room.`);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve("./Public")));
app.use(express.static(path.resolve("./Public/images")));
app.use(authenticateUser('token'));


app.use("/app", staticRoute);
app.use("/register", ownerRoute);
app.use("/home" , (req,res,next) => {
    if(!req.user) {
        return res.redirect("/app");
    }
    next();
} , homeRoute);
app.use("/request", followRoute);

app.listen(PORT, () => console.log("Server running at PORT:", PORT));