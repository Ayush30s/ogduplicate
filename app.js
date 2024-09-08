require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const ownerRoute = require("./Routes/owner");
const staticRoute = require("./Routes/staticroute");
const { homeRoute } = require("./Routes/home")
const followRoute = require("./Routes/follow")
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cookieParser = require("cookie-parser");
const {authenticateUser} = require("./Middleware/authentication");


const app = express();
const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
    console.log("A new user is connected");

    socket.on("aiMessage", (data) => {
        console.log('Message received from client:', data);

        //data is recieved from client know send the data to clicent after gettig from chat gpt

        // Send a response back to the client
        socket.emit('serverMessage', "protein");
    });
});




// "mongodb://127.0.0.1:27017/Gym"
// mongodb+srv://ayushgym:ayushgymapp@cluster0.c2fwa.mongodb.net/gym
mongoose.connect("mongodb://127.0.0.1:27017/Gym")
    .then(() => console.log("MonogDB connected Successfully"))
    .catch((err) => console.log("err :", err))

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

server.listen(PORT, () => console.log("Server running at PORT:", PORT));