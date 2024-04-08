const express = require('express');
const router = express.Router();
const User = require('../models/user.js')




router.get("/signup",(req,res)=>{
    res.render("User/Signup.ejs");
})
router.post("/signup",(req,res)=>{
    console.log(req.body)
     // const newUser = new User({email,username});
     // const regestereduser = await User.register(newUser,password);
     // console.log(regestereduser);
     // req.flash("success" , "User Regestered !!")
     res.send("Wait")
 })





module.exports = router