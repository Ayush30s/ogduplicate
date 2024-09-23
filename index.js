require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const ownerRoute = require("./Routes/owner");
const staticRoute = require("./Routes/staticroute");
const { homeRoute } = require("./Routes/home")
const followRoute = require("./Routes/follow")
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
const {authenticateUser} = require("./Middleware/authentication");
const { blogRouter } = require("./Routes/blog")
const userModel = require("./Models/user");
const RequestModel = require("./Models/request")

const app = express();
const PORT = process.env.PORT;

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",  // Adjust this to your client URL in production for security
      methods: ["GET", "POST"]
    }
});
  
// Create a map to store admin or profile socket IDs
let adminSocketID = null;
const connections = [];

io.on("connection", (socket) => {
    // Listen for the 'joinRequest' event from the first page
    console.log("new user connected : ", socket.id);
    socket.on("joinrequest", async(data) => {
        connections[data.userId] = socket.id;
        console.log("connections ",connections);

        const n = await RequestModel.create({
            userId: data.userId,
            gymId: data.gymId,
            status: "pending"
        })

        console.log(n);
    });

    socket.on("reqaccept", async(data) => {
        connections[data.gymId] = socket.id;
        console.log("connection array : ", connections);
        console.log("Show request data received:", data);
        const ud = await RequestModel.findOneAndUpdate(
            {
                userId: data.userId.userId._id, 
                gymId: data.gymId
            },
            { $set: { status: "accepted" } },
            { new: true }  // Option to return the updated document
        );
        
        console.log(data.userId.userId._id," " , data.gymId ," ", connections[data.userId.userId._id])
        socket.to(connections[data.userId.userId._id]).emit("backendacc", {
            userId: data.userId.userId._id,
            gymId: data.gymId
        });
    });

    socket.on("reqreject", (data) => {
        console.log("Show request data received:", data);
    });
});

// 
mongoose.connect("mongodb+srv://ayushgym:ayushgymapp@cluster0.c2fwa.mongodb.net/gym")
    .then(() => console.log("MonogDB connected Successfully"))
    .catch((err) => console.log("err :", err))

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/" , (req,res) => {
    return res.render("frontpage");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
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

//only allow users to use blog service
app.use("/blog", async(req, res, next) => {
    console.log(req.user)
    const userData = await userModel.findOne({email : req.user.email});

    // Ensure req.user exists and usertype is accessible
    if (!req.user) {
        return res.status(401).send("User not authenticated");
    }

    // Check if the user is an OWNER
    if (!userData) {
        return res.send("Owner Id can't be used to create blog, use a user Id.");
    }

    // If user is not an OWNER, proceed
    next();
}, blogRouter);


server.listen(PORT, () => console.log("Server running at PORT:", PORT));