const express=require('express') 
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model('Post')
const User=mongoose.model('User')



/*
some error is their dont know where going wrong..
router.get("/user/:id",requireLogin,(req,res)=>{  // we will get this id from the front end.....
// now with the help of this id we first have to find this user...
    User.findOne({user_id:req.params.id})
    .select("-password") //we dont want to send the password at the front end..
    .then(user=>{
        // now we got taht user...now we will make the 2nd query...
        // to fetch all the posts made by that user......
        Post.find({postedby:req.params.id})
        .populate("postedby","_id name")
        .exex((err,posts)=>{
            if(err)
            {
                return res.status(404).json({error:err})
            }
            res.json({user,posts})
        })
    })
    .catch(err=>{
        return res.status(404).json({error:"user not found"})
    })
})*/

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedby:req.params.id})
         .populate("postedby","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})



router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{ //req.body.followId lets just assume this is the id we are recieving and it is the id of the suresh(the logged in user has followed suresh..)
        $push:{followers:req.user._id} // pehle hamne ramesh logged in user ki id ko suresh ke followers array mei push kr diya hai

    },{
    new:true // as mongodb will give us the old data but we want the new one..
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err}) // this we are sending from the backend to the frontend..
        }
        // now we need to update the following of the logged in user(ramesh..)
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId} // ramesh ki following mei suresh ki id push kr di hai...aur suresh ki id front end se aaa rahi hai and ramesh ki id req.used._id se aa rahi hai..

        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
            // agar koi error hogi tu usse ham backend se send kr rahe hain.....aur we will console.log
            // this erros at the front end..
        })
    }
    )
})


router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{ 
        $pull:{followers:req.user._id} 

    },{
    new:true 
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err}) 
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId} 

        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
            // agar koi error hogi tu usse ham backend se send kr rahe hain.....aur we will console.log
            // this erros at the front end..
        })
    }
    )
})

router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err)
            {
                return res.status(422).json({error:"pic cannot post"})
            }
            res.json(result)
    })
    // this req.body we are retrieving the pic from the client side...
})

// used for the search user functionality...
// iska method post hai kyunki front end se data aa rha hai...aur uss data ko jo user ne dala hai ham query ke form receive kr rahe hain..
// yahan pr query se fetch kr rahe hain tu vahan pr bhi key ka name query rakha hai..
router.post("/search-users",(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query) // the query is coming from the front end and it will send the whole record
    User.find({email:{$regex:userPattern}}) // finding the email in the user model
    .select("_id email") //backend se sirf id aur email bhej rahe hain rather then sending the complete record
    .then(user=>{
       res.json({user:user}) // ye backend se front end pr send kr rahe hain..
       // ye eik js object hai what we are sending fron the back end..
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports=router // now we need to require that in our app.js