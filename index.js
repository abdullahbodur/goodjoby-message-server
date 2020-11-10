const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDatabase = require("./helper/connectDatabase/connectDatabase");
const socket = require('./sockets/socket');

dotenv.config({
  path: "./config/env/config.env",
});


connectDatabase();


const server  = socket(app);


const PORT = process.env.PORT || 4321;

server.listen(PORT, () => { 
  console.log("Message server started at : " + PORT);
});
