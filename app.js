const ejs=require('ejs');
const bodyParser=require('body-parser');
const express=require('express');
const multer = require('multer');
const path= require('path');
let app=express();
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,"./public/images");
    },
    filename :(req,file,cb) =>{
        console.log(file);
        cb(null,Date.now()+ path.extname(file.originalname))
    }
})
const upload =multer({storage:storage});
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine',ejs) ; 
app.use(express.static("public"));
app.get("/",function(req,res){
    res.render("signup.ejs");
});
app.get("/upload",(req,res)=>{
    res.render("upload.ejs");
});
app.post("/upload",upload.single("image"),(req,res)=>{
    res.send("image uploaded");
})
app.get("/navbar",function(req,res){
    res.render("navbar.ejs");
});
app.get("/profile",function(req,res){
  res.render("profile.ejs");
});
app.post('/',(req,res)=>{
    res.render("navbar.ejs");
});

app.listen(3002,function(){
    console.log("server is running on port 3002");
})

