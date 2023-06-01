const ejs=require('ejs');
const bodyParser=require('body-parser');
const express=require('express');
const multer = require('multer');
const path= require('path');
const mongoose=require("mongoose");
let app=express();
var Email_value;
var image_particular_user_array=[];

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('images');

mongoose.connect("mongodb://127.0.0.1:27017/imageDB", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine',ejs) ; 
app.use(express.static("public"));
//schema
const imageSchema=new mongoose.Schema({
    imageName:String,
    caption:String
});
//schema to store user info
const userInfo=new mongoose.Schema({
    name:String,
    phoneNo:Number,
    email:String,
    password:String,
    imageuploded:[imageSchema]
});
//model
const imageData=new mongoose.model("imageData",imageSchema);
const userData=new mongoose.model("userData",userInfo);

app.get("/",function(req,res){
    res.render("signup.ejs");
});
app.get("/upload",(req,res)=>{
    res.render("upload.ejs");
});



app.post("/upload",upload,(req,res)=>{
   var image=req.file.originalname;
   var Caption=req.body.captions;
        
   console.log(image);
   const Image=new imageData({
         imageName:image,
         caption:Caption
   });

   Image.save().then(function(){
    console.log("saved succesfully")
    res.redirect("/navbar");
   }).catch(function(err){
    console.log(err);
   });
 //inserting image uplode data into user info collection
image_particular_user_array.push(Image);
userData.findOneAndUpdate({email:Email_value}, { imageuploded:image_particular_user_array }).then(function(){
                console.log("successfully inserted the image data into user data");
            }).catch(function(err){
                console.log("error in update function");
                console.log(err);
            });

})
app.get("/navbar",function(req,res){
    imageData.find().then(function(result){
        var count=result.length;
        // console.log(count);
        // console.log(result[1].imageName);
        res.render("navbar.ejs",{count:count,Result:result});
    }).catch(function(err){
      console.log(err);
    });
   
});
app.get("/profile",function(req,res){
  res.render("profile.ejs");
});

app.post('/',function(req,res){
    Email_value=req.body.email;
    const  newUser=new userData({
        name:req.body.First_Name,
        phoneNo:req.body.Last_Name,
        email:req.body.email,
        password:req.body.city_name
    });
     newUser.save().then(function(){
        console.log("user data successfully saved");
     }).catch(function(err){
         console.log(err);
     })
    res.redirect("/navbar");
});

app.listen(3000,function(){
    console.log("server is running on port 3000");
})

