const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
const postschema=new mongoose.Schema({
    body:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,  // ye text hai.....are bhai...
        postedby:{
            type:ObjectId,
            ref:"User"
        }
    }],
    postedby:{
        type:ObjectId,
        ref:"User" // this model ko connect kr diya hai with the User model in user.js
    }
},{timestamps:true})
mongoose.model("Post",postschema);
// Post is the name of the model...defined in post.js and postschema is the name of the schema...
//whenver we are using this model in any of our file we will including by this name "Post"
// basically the structure of our post how it will be..
// now we need to register this model in app.js
// likes is basicaly an array taht conatin the ids of all the users who liked the post..
// timestamps:true this is done so that the newly added post should come on the top...