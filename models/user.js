const mongoose=require('mongoose')
// here we dont need express so we have not require it..
const {ObjectId}=mongoose.Schema.Types
const userSchema=new mongoose.Schema({
    name:{
        type:String,  // in JS String is like this S is in uppercase..
        required:true // it is mandatory for user to enter his name..
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    aboutus:{
        type:String,
        required:true,
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/paragpramodroy/image/upload/v1616027926/no-image_e2cekh.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema); // we need to register this model in app.js
// User is the name of this model and we will be using this name in auth.js
//userSchema is the name of the name that ise defined here