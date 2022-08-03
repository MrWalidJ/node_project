const express = require("express");
// const joi = require("joi") ;
// const jwt = require("jsonwebtoken") ;
 const _ = require("lodash");
const { User } = require("../models/User");


// to bring user details to display in the profile : we get the info from payload method
const auth = require("../middlewares/auth");
const router = express.Router();

//req,res are for handling request so we put auth between get and (req,res
// if auth secceeds , it will move to execute to the following functions
router.get("/" ,auth , async(req,res)=>{   // auth can be used for multiple files

    try{
        const user = await User.findById( req.payload._id ); // thi is based on _id
        res.status(200).send(_.pick(user, ["_id" , "name" , "email","biz"])) ; // pick fields to display
      }
    catch(err){
        res.status(400).send("error in profile");
    }
} );

module.exports = router ;