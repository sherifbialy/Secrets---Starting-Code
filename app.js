//jshint esversion:6
const express=require('express');
require('dotenv').config();
const session= require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
//const mongoose=require('mongoose');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");
//const md5=require('md5');
//const bcrypt=require('bcrypt');
//const saltRounds=10;
//const encrypt=require("mongoose-encryption");
const app = express();
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: "Long ass secret string.",
  resave: false,
  saveUninitialized: false,
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB")
const userSchema= new mongoose.Schema({
    username:String,
    password:String
})
userSchema.plugin(passportLocalMongoose);

//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
const User=mongoose.model("Users",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home")
})
app.get("/login",function(req,res){
    res.render("login")
})
app.get("/logout",function(req,res){
     req.logout(function(){
        
     });
     res.redirect("/");
})
app.post("/login",function(req,res){
    const user=new User({
    username:req.body.username,
    password: req.body.password
    });
    r
    qeq.login(user,function(err){
        if(err){
            console.log(err);
            //res.redirect("/login")
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")})
        }
    })
    
    // const username=req.body.username;
    // //const password=md5(req.body.password);
    //  const password=req.body.password;
    // User.findOne({username:username},function(err,foundUser){
    //     if(err){
    //         console.log(err)
    //     }
    //     else{
    //         if(foundUser){
    //         bcrypt.compare(password,foundUser.password,function(err,result){
    //             if(result===true){
    //             res.render("secrets")
    //             }
    //             else{
    //                 res.send("Password is Incorrect");
    //               }

    //         })
              
              
    //         }
    //     }
    // })


})
app.get("/register",function(req,res){

    res.render("register")
})
app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
})
app.post("/register",function(req,res){
    // bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    //     newUser= new User({
    //         username:req.body.username,
    //         password: hash
    //     })
    //     newUser.save(function(err){
    //         if(!err){
    //             res.render("secrets");
    //         }
    //         else{
    //             res.send(err);
    //         }
    
    //     })  
    // })
 
    User.register({username:req.body.username},req.body.password,function(err,user){
         if(err){
            console.log(err);
            res.redirect("/register")
         }
         else{
            passport.authenticate("local")(req,res,function(){
                res.render("secrets");
            })
         }
    })
})

app.listen(3000, function(){
    console.log("Server Started on 3000");
})