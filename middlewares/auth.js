// we put this file as a middleware before handling a get request to get the profile details
// we put "auth" in side get request in profile.js

const jwt = require("jsonwebtoken") ;

module.exports = (req ,res , next) => {
// get the token from headers 
 const token = req.header("Authorization");
 if(!token) return res.status(401).send("access denied , no token provided");

// decryption of the token and getting the payload
try{
const payload = jwt.verify(token , process.env.jwtKey) // check if the token really has the secret key
req.payload = payload ;  
next();
} catch(err){

res.status(400).send("Invalid token");
}

} ;


