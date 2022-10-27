const express = require("express");
const joi = require("joi") ;
const _ = require("lodash") ;
const {Card}  = require("../models/Card");

const auth = require("../middlewares/auth");
const router = express.Router();

const cardSchema = joi.object({
    
    name: joi.string().required().min(2),
    address : joi.string().required().min(2),
    description: joi.string().required().min(2),
    phone: joi.string().required().regex(/^0[2-9]\d{7,8}$/) ,
    image : joi.string().required()
    
    })

// Card number generation
  const genCardNumber = async()=>{
 while(true){

    let randomNum =  _.random(1000 , 999999); // generate random numbers between 1000 and 999999
    let card = await Card.findOne({cardNumber : randomNum})
    if(!card) return randomNum ;  // check if there is a card with the same number
 }
 
  }
//Adding new card
router.post("/" ,auth ,  async(req,res) => {
 try{  
//1. joi validation for body
const {error} = cardSchema.validate(req.body)
 if(error) return res.status(400).send(error.message)


  //2. Add card number + user_id
let card = new Card(req.body);
card.cardNumber = await genCardNumber();
card.user_id = req.payload._id ;


 //3. send token to client
 await card.save() ;
 res.status(201).send(card); 
 } catch(err){
    req.status(400).send("Error in posting card");

 }
});

//part(8) - all cards of specific user
router.get("/my-cards" , auth , async(req,res) => {
    try{
    const myCards = await Card.find({ user_id:req.payload._id});
    // if(myCards.length == 0) return res.status(404).send("there are no cards");
    res.status(200).send(myCards) ;
    }
    catch(err){
        res.status(400).send("Error in GET  user cards") ;
    }
    
    });

//part(5): get specific cards of specific user
router.get("/:id" ,auth , async (req,res)=>{
try{
 let card = await Card.findOne({_id: req.params.id , user_id:req.payload._id})
 if(!card) res.status(404).send("Card not found") ;
 res.status(200).send(card) ;
}
catch(err){
res.status(400).send("Error getting the card");
}
});

// part(6)
router.put("/:id" ,auth ,  async(req,res)=>{

    try{
        const {error} = cardSchema.validate(req.body)
        if(error) return res.status(400).send(error.message);

        let card = await Card.findByIdAndUpdate({_id:req.params.id , usre_id:req.payload._id},req.body,{new:true})
        if(!card) return res.status(404).send("Card not found") ;
        res.status(200).send(card);    
    }
   catch(err){
        
    res.status(400).send("Error in PUT specific card") ;
   }
} );

//part(7)

router.delete("/:id" ,auth ,  async(req,res)=>{
try{
    let card = await Card.findByIdAndRemove({_id:req.params.id , usre_id:req.payload._id});
    if(!card) return res.status(404).send("Card not found") ;
        res.status(200).send("Card was deleted"); 
}
catch(err){
    res.status(400).send("Error in DELETE specific card") ;
}

});



//part(9) - All cards
router.get("/" , auth , async(req,res) => {
try{
    let cards = await Card.find();
    res.status(200).send(cards) ;
}
catch(err){
    res.status(400).send("Error in displaying the cards") ;
}

})

module.exports = router ;