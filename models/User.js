const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength:1024,
    unique: true
  },
  password: {
    type: String,
    minlength: 3,
    maxlength: 1024,
    required:true
  },
  biz: {
    type: Boolean,
    required: true
  }
});

const User = mongoose.model("users", userSchema); // if we put "user" it will add a collection with name "users"
module.exports =  {User} ;
