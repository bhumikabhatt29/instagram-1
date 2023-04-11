let ejs = require('ejs');
const express=require('express');
const http=require("https");
let app=express();
app.set('view engine',ejs) ; 
app.use(express.static("public"));
app.get("/",function(req,res){
    res.render("navbar.ejs");
}) ;
app.listen(5500,function(){
    console.log("server is running on port 5500");
})