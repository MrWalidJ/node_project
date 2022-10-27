const express = require("express");
const joi = require("joi") ;
const bcrypt = require("bcrypt");
const  User  = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

const registerSchema = joi.object({
name: joi.string().required().min(2) ,
email: joi.string().required().min(6) .max(1024).email() ,
password : joi.string().required().min(2).max(1024),
biz: joi.boolean().required(),
});

router.post("/" , async(req,res) => {
    try{
//1. joi validation for body
const {error} = registerSchema.validate(req.body)
 if(error) return res.status(400).send(error.message)



 //2.  check if already exist
let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exist");

 user = new User(req.body)
 //3. encryption to password(salt + hash + ...)
const salt = await bcrypt.genSalt(10); // salt generation
user.password = await bcrypt.hash(user.password , salt) ; // encryption 


 //4. create and save user in db part1 and 4 should be 201

await user.save();

let genToken = jwt.sign({
    _id:user._id , biz:user.biz}, process.env.jwtKey // secret key is in env file
);
res.status(201).send({token: genToken});   
    } catch(err){
        res.status(400).send("Error posting user");
    }

});


module.exports = router ;