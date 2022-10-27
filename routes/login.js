const express = require("express");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("../models/User");
const router = express.Router();

const loginSchema = joi.object({
  email: joi.string().required().min(6).max(1024).email(),
  password: joi.string().required().min(3).max(1024),
});

// const generateToken = (payload,key) => {

//     const token = jwt.sign(payload ,key);
//     return token ;
// }

router.post("/", async (req, res) => {
  try {
    //1. joi validation for body
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.message);

    //2.  check if user exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("invalid email or password");

    //3. check passwordif it's true for the user , using compare
    const result = await bcrypt.compare(req.body.password, user.password); //(pass in request , pass in DB)
    if (!result) return res.status(400).send("Invalid email or password");

    //4. send token to client
    const genToken = jwt.sign(
      { _id: user._id, biz: user.biz },
      process.env.jwtKey
    );
    res.status(200).send({ token: genToken });
  } catch (error) {
    res.status(400).send("Error in post user login");
  }
});

// we want to display user profile through each request so we do the following
// create profile.js in routes

module.exports = router;
