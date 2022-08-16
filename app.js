//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongodb = require("mongodb");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
}

const userSchema = new mongoose.Schema({
  email:String,
  password:String
})
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["password"]} );
const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})
app.post("/register",function(req,res){
  const newemail = req.body.username;
  const newpassword = req.body.password;
  const user = new User({
    email:newemail,
    password:newpassword
  })
  user.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets")
    }
  });

})
app.post("/login",function(req,res){
  const eml = req.body.username;
  const psw = req.body.password;
  User.findOne({email:eml},function(err,found){
    if(err){
      console.log(err);
    }else{
      if(found){
        if(found.password===psw){
          res.render("secrets");
        }else{
          console.log("Password does not exist");
        }

      }else{
        console.log("No User Exist");
      }
    }
  })
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
