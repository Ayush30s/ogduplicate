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

const app = express();
const PORT = process.env.PORT;

app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

// Create a map to store admin or profile socket IDs
let adminSocketID = null;

// Handle user connections
io.on('connection', (socket) => {
    console.log('A new user connected with socket ID:', socket.id);

    socket.on("aiMessage", (data) => {
        console.log('Message received from client:', data);

        //data is recieved from client know send the data to clicent after gettig from chat gpt

        // Send a response back to the client
        socket.emit('serverMessage', "protein");
    });

    // Check if the user is the admin (assuming they connect as an admin)
    socket.on('registerAdmin', () => {
        adminSocketID = socket.id; // Store the admin's socket ID
        console.log('Admin connected:', adminSocketID);
    });

    // Handle the join request from the user
    socket.on('joinGym', (data) => {
        console.log(`join gym`);

        // Send a confirmation message back to the user
        socket.emit('joinConfirmation', 'Your request to join the gym has been sent!');
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        if (socket.id === adminSocketID) {
            adminSocketID = null; // Admin disconnected
        }
    });
});

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
app.use("/blog", blogRouter);

server.listen(PORT, () => console.log("Server running at PORT:", PORT));