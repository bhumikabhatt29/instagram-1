const ejs=require('ejs');
const bodyParser=require('body-parser');
const express=require('express');
let app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine',ejs) ; 
app.use(express.static("public"));
app.get("/",function(req,res){
    res.render("signup.ejs");
});
app.get("/navbar",function(req,res){
    res.render("navbar.ejs");
});
app.post('/',(req,res)=>{
    res.render("navbar.ejs");
});
app.listen(3001,function(){
    console.log("server is running on port 3001");
})

