const ejs = require('ejs');
const bodyParser = require('body-parser');
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require("mongoose");
//require packages
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
let app = express();
var Email_value;
var num;
var Bio;
var edit_image_caption;
var index_value;
var profileImage="default profile.jpg";
var image_particular_user_array = [];
//this will help the user to uplode images from the local system
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var profileupload=multer({storage:storage}).single("Image");
var upload = multer({ storage: storage }).single('images');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', ejs);
app.use(express.static("public"));

//setting up session and passport
app.use(session({
    secret: 'this is my secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb://127.0.0.1:27017/imageDB", { useNewUrlParser: true });//database name changed to userdb
mongoose.connect("mongodb+srv://divyanshtanwar04:12345@cluster0.2mlwrvy.mongodb.net/UserDB");

//schema
const imageSchema = new mongoose.Schema({
    imageName: String,
    caption: String
});
//schema to store user info
const userInfo = new mongoose.Schema({
    name: String,
    phoneNo: Number,
    email: String,
    password: String,
    imageuploded: [imageSchema]
});
//schemato store profile info
const profile=new mongoose.Schema({
    Email: String,
    profileName: String,
    bio:String
});
//writting plugin
userInfo.plugin(passportLocalMongoose,{
    usernameField : "email" 
});
//model
const imageData = new mongoose.model("imageData", imageSchema);
const userData = new mongoose.model("userData", userInfo);
const profileData=new mongoose.model("profileData", profile);
//using passport local moongoose features
passport.use((userData.createStrategy({usernameField: 'email',},userData.authenticate())));
passport.serializeUser(userData.serializeUser());
passport.deserializeUser(userData.deserializeUser());

app.get("/", function (req, res) {
    res.render("signup.ejs");
});

app.get("/upload", (req, res) => {
    res.render("upload.ejs");
});

app.get("/edit", (req, res) => {
    res.render("edit.ejs");
});

app.get("/navbar", function (req, res) {
    if (req.isAuthenticated()) {
        console.log("inside /navbar");
       
        profileData.findOne({ Email: Email_value }).then(function (re) {
            profileImage=re.profileName;
            Bio=re.bio;
            console.log(Bio);
            console.log(profileImage);
           console.log(re.profileName);
    }).catch(function(err){
        console.log(err);
    });
        userData.findOne({ email: Email_value }).then(function (result) {
            var count = result.imageuploded.length;
            //num is used in /delete route
            num = count;
            console.log(result.name);
            //updating name as user name
            res.render("navbar.ejs", { count: count, Result: result.imageuploded, Name: result.name,img:profileImage });
        }).catch(function (err) {
            console.log(err);
        });
    }
    else {
        res.redirect("/login");
    }


})

app.get("/profile", function (req, res) {
    console.log("insise profile route")
    // console.log(profileImage);
    // console.log(Bio);
    userData.findOne({ email: Email_value }).then(function (r) {
        var count = r.imageuploded.length;
        console.log(r);
        console.log(r.imageuploded.length);
        res.render("profile.ejs", { count: count, Result: r.imageuploded, Name: r.name,num:num, img:profileImage, bio:Bio });
    }).catch(function (err) {
        console.log(err);
    });
});

app.get("/login", function (req, res) {
    res.render("login.ejs");
});

app.post("/upload", upload, (req, res) => {
    var image = req.file.originalname;
    var Caption = req.body.captions;
    console.log(image);
    const Image = new imageData({
        imageName: image,
        caption: Caption
    });
    Image.save().then(function () {
        console.log("saved succesfully")
        res.redirect("/navbar");
    }).catch(function (err) {
        console.log(err);
    });

    //inserting image uplode data into user info collection
    image_particular_user_array.push(Image);
    userData.findOneAndUpdate({ email: Email_value }, { imageuploded: image_particular_user_array }).then(function () {
        console.log("successfully inserted the image data into user data");
    }).catch(function (err) {
        console.log("error in update function");
        console.log(err);
    })

})

//check if mail and password mathches from our database
app.post("/login", function (req, res) {

    Email_value = req.body.email;
    pass = req.body.password;
    const user=new userData({
        email:Email_value,
        password:pass
    });
    //checking if credential matched or not to our database
    req.login(user,function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            passport.authenticate("local") (req,res,function(){
                res.redirect("/navbar");
             });
        }
    })

})

app.post('/', function (req, res) {
    Email_value = req.body.email;
    const data = new profileData({
        Email: Email_value,
        profileName :profileImage,
        bio:Bio
    });
    data.save().then(function () {
        console.log("saved succesfully the profile data")
        // res.redirect("/navbar");
    }).catch(function (err) {
        console.log(err);
    });
    password = req.body.password;
    const name = req.body.fullname;
    const phoneNo = req.body.phonenumber;
    //registering user
    userData.register(new userData({
        email: Email_value,
        name: name,
        phoneNo: phoneNo
    }),
        password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect("/");
            }
            else {
                console.log("inside else statement");
                passport.authenticate("local")(req, res, function () {
                    console.log("data is authenticated ,redirecting to .navbar");
                    res.redirect("/navbar");
                });
            }
        });
});

//but not satisfied with the approch ,website will become slow as data increases for data >100000 delete function
//will take approx 1 sec which is slow
app.post("/delete", function (req, res) {

    console.log("/delete route");
    var id = req.body.Delete_post;
    var index_value;
    //finding user who has log in
    userData.findOne({ email: Email_value }).then(function (result) {
        for (var i = 0; i < num; i++) {   //finding index of image in array
            const img_id = result.imageuploded[i]._id;
            if (img_id == id) {
                index_value = i;
            }
        }
        //deleting object
        (result.imageuploded).splice(index_value, 1);
        //saving changes
        result.save();
        console.log("successfully Deleted baby");
        res.redirect("/navbar");
    }).catch(function (err) {
        console.log(err);
    });
});

app.post("/edit", function (req, res) {
    //console.log("request aa gye re baba");
    var Id = req.body.Edit_post;
    console.log(Id);
    edit_image_caption = Id;
    res.render("edit.ejs");
})

app.post("/editCaption", function (req, res) {
    const captionValue = req.body.newcaption;
    var index_value;
    // console.log(captionValue);
    userData.findOne({ email: Email_value }).then(function (result) {
        for (var i = 0; i < num; i++) {
            //finding index of image in array
            const img_id = result.imageuploded[i]._id;
            if (img_id == edit_image_caption) {
                index_value = i;
            }
        }
        console.log(index_value);
        result.imageuploded[index_value].caption = captionValue;
        result.save();
        res.redirect("/navbar");
    }).catch(function (err) {
        console.log(err);
    })
});
app.get("/edit-profile", function (req, res) {
    //console.log("request aa gye re baba");
    res.render("profile-edit.ejs");
});

app.post("/edit-profile",profileupload, function (req, res) {
    console.log("inside edit-profile route");
    var name=req.body.Name;
    profileImage=req.file.originalname;
    Bio=req.body.Bio;
    // console.log(Bio);
    userData.findOne({ email: Email_value }).then(function (result){
       result.name=name;
    //    console.log(name);
       result.save();
       console.log("user data name  saved successfully");
    }).catch(function (err) {
        console.log(err);
    })
    profileData.findOne({Email:Email_value}).then(function(Result){
        console.log(profileImage);
        console.log(Bio);
        Result.bio=Bio;
        Result.profileName=profileImage;
        Result.save();
        console.log("profile data saved successfully");
        res.redirect("/profile");
    }).catch(function (err) {
        console.log(err);
    })
  
});

app.post("/logout",function(req,res){
   console.log("logout request");

   req.logout(function(err) {
    if (err)
     {
         return next(err); 
     }
     else
     {
        res.redirect('/login');
     }
    
  });
});

// app.listen(3000, function () {
//     console.log("server is running on port 3001");
// })
var port = process.env.PORT || 3000;
app.listen(port);

