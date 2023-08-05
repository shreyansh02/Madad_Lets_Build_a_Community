const express = require('express')
const router = express.Router()
// as we are writing routes in a separate file...
// with the help of this router we can make get and post request..
const bcrypt = require('bcryptjs') // we need to hash the password..
const mongoose = require('mongoose')
const User = mongoose.model('User') // we also need that model where the schema is defined..
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../config/keys') // ..isiliye apply kiya hai bcz we are in auth that is inside routes folder
const requireLogin=require('../middleware/requireLogin')

/*
router.get("/", (req, res) => {
    res.send("hello ji...")
})*/
// now we need to export this router and also need to register in app.js

// now we are creating a route that has protected resource and to access that..
// we are passing a middleware in it that will verify the user and then will get the access of those resources

// this callback function will be triggered when the user requests for the signup route..
router.post("/signup", (req, res) => {
    const { name, email, password,phone,aboutus,pic} = req.body // destructure kiya hai..by this we get the data coming from the front end..
    if (!name || !email || !password || !phone||!aboutus) {
        return res.status(422).json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((saveduser) => {
            if (saveduser) {
                return res.status(422).json({ error: "User already exist with that email" })
            }
            // the user does not exist in the database taht is a new user and we have to push the data to database
            bcrypt.hash(password, 12) // ye password vo hai jo useer ne daala hai..
                .then(hashedpassword => {
                    // creating a new user according to the schema User
                    const user = new User({
                        email,// key is accoring to taht define in the schema in user.js and value is what we have destructured  email:email,
                        password:hashedpassword,// password:password, as key and value both are same so we are writing it like this
                        name,// name:name
                        phone,
                        aboutus,
                        pic:pic // getting the profile pic of the user from the front end...
                    })
                    // we will be now saving this to our database..befor saving we will hash the password..
                    user.save()
                        .then((user) => {
                            res.json({ message: "saved successfully" })
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                })

        })
        .catch((err) => {
            console.log(err)
        })
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body // destsructure kiya hai...
    if(!email || !password){
        return res.status(422).json({message:"Please add both email and password"})
    }
    User.findOne({email:email}) // query to the database....
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({message:"invalid emailid or password..."})
        }
        // agar yahan tak aa gaye hain iska matalb vo emailid hai database mei...
        // ab now we need to compare the stored password and the one that is given by the client..
        bcrypt.compare(password,savedUser.password)
        .then(domatch=>{
            if(domatch){
                //res.status(200).json({message:"user successfully signed in.."})
                // now we will assign the token to the user..
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                // now we will pass this token..
                const {_id,name,email,followers,following,pic,phone,aboutus}=savedUser  // we have destructured these thing and then we will gonna to send this to the client side..
                // here we alos have to add the default pic that we need to send to the front end if the user has not posted any pic..
                res.json({token:token,user:{
                    _id,
                    name,
                    email,
                    followers,
                    following,
                    pic,
                    phone,
                    aboutus
                }})
                // and this what we are sending from the server side to the front end....
                // and from here we will be sending the details of the user to the front end....
                // we have the details of the user present inside the savedUser
                // yahan successfull signup pr koi bhi message nhi send kiya hai.....thats why we have to write the message on the client side
            }
            else{
                return res.status(422).json({message:"invalid emailid or password..."})
            }
        })
        .catch(err=>{
            console.log("the error at the developer end",err)
        })
    })
    .catch(err=>{
        console.log(err)
    })

})
module.exports = router