const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");

app.use(session({secret: 'mysecretcode',resave:false,saveUninitialized:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.get("/get",(req,res)=>{
    res.send("session page..!");
})

app.listen(3000,(req,res)=>{
    console.log("connection the 3000");
})