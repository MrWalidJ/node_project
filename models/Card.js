const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true,
    minlength: 2
  },
  address: {
    type: String,
    required: true,
    minlength: 2
  
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
},
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,

  },
  image: {
    type: String,
    required: true
  },
  cardNumber: {    // we generate the card number with lodash which is unique
    type: Number,
    required: true,
    unique: true
  },
  user_id: {   // we get user_id from the token payload , we insert it in the document we generate
    type: mongoose.Schema.Types.ObjectId,  // the type is object_id , this is taken from mongoose objects
    ref: "users",   // means that object id above is related to _id in users collection
    required: true
  }


});

const Card = mongoose.model("cards", cardSchema); // if we put "user" it will add a collection with name "users"
module.exports = { Card };
