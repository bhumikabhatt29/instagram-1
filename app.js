let ejs = require('ejs');
const bodyParser=require('body-parser');
const express=require('express');
app.use(bodyParser.urlencoded({ extended: true }));
let app=express();
app.set('view engine',ejs) ; 
app.use(express.static("public"));
app.get("/",function(req,res){
    res.render("signup.ejs");
});
app.listen(3000,function(){
    console.log("server is running on port 3000");
})