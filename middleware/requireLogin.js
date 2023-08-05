const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require('../config/keys')
const mongoose=require('mongoose')
const User=mongoose.model('User')
module.exports=(req,res,next)=>{  // from here we are gonna to export this middleware function.
   const {authorization}=req.headers
   // authorization=Bearer token....
   // authorization is basically a string and from that string we are fetching the token given by user
   if(!authorization){
       return res.status(401).json({message:"user must be logged in.."})
   }
   const token=authorization.replace("Bearer ","")
   //now we need to verify this token with the JWT_SECRET key..
   jwt.verify(token,JWT_SECRET,(err,payload)=>{
       if(err)
       {
        return res.status(401).json({message:"user must be logged in.."})
        // iska matlab hai ko vo token match nhi ho paya hai....
       }
       const {_id}=payload // now this_id has token...
       // go to auth.js->post route of signin-> go to the code where we are assigning the token to the user at the time of sign in
       // now we have to find the user with that id..
       User.findById(_id)
       .then(userdata=>{
           // now we can access the user data bcz we searched for that id..
           req.user=userdata
           next() // this is used so that flow can go further to the next middleware or line of code
           // we have used it here bcz we should call it when we are done with the assignment..
           // as we know that nodejs is single thread non blocking input output model..that is it 
           // continioulsy running by wriing this the application will go to the next phase..
       })
       

   })

}