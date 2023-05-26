const ejs=require('ejs');
const bodyParser=require('body-parser');
const express=require('express');
const multer = require('multer');
const path= require('path');
const mongoose=require("mongoose");
let app=express();

// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//       cb(null,"./public/images");
//     },
//     filename :(req,file,cb) =>{
//         console.log(file);
//         cb(null,Date.now()+ path.extname(file.originalname))
//     }
// })

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

// const upload =multer({storage:storage});

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
//model
const imageData=new mongoose.model("imageData",imageSchema);

app.get("/",function(req,res){
    res.render("signup.ejs");
});
app.get("/upload",(req,res)=>{
    res.render("upload.ejs");
});

// app.post("/upload",upload.single("images"),(req,res)=>{

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

})
app.get("/navbar",function(req,res){
    imageData.find().then(function(result){
        var count=result.length;
        console.log(count);
        console.log(result[1].imageName);
        res.render("navbar.ejs",{count:count,Result:result});
    }).catch(function(err){
      console.log(err);
    });
   
});
app.get("/profile",function(req,res){
  res.render("profile.ejs");
});

app.post('/',(req,res)=>{
    res.redirect("/navbar");
});

app.listen(3000,function(){
    console.log("server is running on port 3000");
})

