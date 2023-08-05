const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const requireLogin=require('../middleware/requireLogin')
const Post=mongoose.model('Post')
// here we separately creating the route for post just like we have done for the signup and signin


// now we will make a route handler whihch is of get type bcz the user is demanding all the posts..
router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

// by the help of this we are able to see the psot of the users whom i follow.....
//before doing this i am alos able to see the post made by me...in the home..
router.get("/getsubpost",requireLogin,(req,res)=>{
    // if the posted by is present in the following list then only return the post..
    // that is if a particular user is present or not then only return me the post..
    Post.find({postedby:{$in:req.user.following}})
    .populate("postedby","_id name")
    .populate("comments.postedby","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts:posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/createpost",requireLogin,(req,res)=>{
    const {title,body,pic,phone,address}=req.body // jo user ne post mei title aur body dala hai usse destructure kr liya hai...
    if(!title || !body || !pic || !phone || !address){
        return res.status(422).json({message:"please fill all the entries.."})
    }
    console.log(req.user.name);
    // once we have verified the user req.user contain all the details of the user...
    // now we will basically create a post of type Post
    req.user.password=undefined // we dont want to print the password with the post..
    const post=new Post({
        title,
        body,
        photo:pic,
        phone,
        address,
        postedby:req.user // req.user contain all the details of the user and it was done after the verifcation of the token of the user
    })
    // now we need to save this post to our database....
    post.save()
    .then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log("error is ",err)
    })
})
// this route will gonna to get all the post of a particular user....useful on the profile page of the user..
/* actually in this route we are accessig req.user that contain all the data of the user...
after the verification of the token so as we are using req.user here so we alos need to pass
the middleware here...so that we are able to access req.user
*/
router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedby:req.user._id})
    .populate("postedby","_id name") // we want to display name and id thats why we have done this
    .populate("comments.postedby","_id name")
    .then(mypost=>{
        res.json({mypost:mypost}) // ye pass hona chahiye yahan se..
    })
    .catch(err=>{
        console.log(err);
    })
})

// ye jo postId hai ye front end se aa rha hai..iske ander jo user signed in hai uski id hai..
router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id} // jis user ne pic ko like kiya uski id ko likes array mei push kr diya
    },{
        new:true // bcz we want that mongodb should give us the updated data..
    }).exec((err,result)=>{
        if(err)
        {
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id} // jis user ne pic ko unlike kiya uski id ko likes array mei se pull out kr diya hai..
    },{
        new:true // bcz we want that mongodb should give us the updated data..
    }).exec((err,result)=>{
        if(err)
        {
            res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId}) // first find the post taht user wnats to delete..// query to our database..
    .populate("postedby","_id")
    .exec((err,post)=>{
        if(err || !post)
        {
            return  res.status(422).json({error:err})
        }
        // now we have the post that user wants to delete now check the ide of post...
        // that if the signed in person has posted that pic then he can delete that..
        if(post.postedby._id.toString() === req.user._id.toString())
        {
            post.remove() // that post is deleted....
            .then(result=>{
                res.json(result) // this is what we are sending from the backend to the frontend
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})

router.delete("/deletecomment/:id/:comment_id", requireLogin, (req, res) => {
    const comment = { _id: req.params.comment_id };
    Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { comments: comment },
      },
      {
        new: true, 
      }
    )
      .populate("comments.postedby", "_id name")
      .populate("postedby", "_id name ")
      .exec((err, postComment) => {
        if (err || !postComment) {
          return res.status(422).json({ error: err });
        } else {
         
          const result = postComment;
          res.json(result);
        }
      });
  });
/*
router.delete("/deletecomment/:commentId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.commentId}) // first find the comment that user wants to delete
    .populate("postedby","_id")
    .exec((err,comment)=>{
        if(err)
        {
            return res.status(422).json({error:"error hai.."})
            // ye ham backend se send kr rahe hain agar kuch error ata hai tu console kr lenge..
        }
        if(!comment)
        {
            return res.status(422).json({error:"wo comment ko fetch nhi kr paa rha hai"})
        }
        // now we got the commnet now we need to ensure that ki...
        // jo comment user ne khud ki hai vo sirf ussi comment ko delete kr sakta hai...
        // iske liye postedby ki id aur current user ki id ko match karke check karenge..
        if(comment.postedby._id.toString()===req.user._id.toString())
        {
            comment.remove() // uss comment ko delte kr diya hai...
            .then(result=>{
                res.json(result) // this is what we have  send from the backednd to the frontend..
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
})*/

// just like what we have did to like a post the same concept will be used here...to comment on the psot
// their we just have to add the id of the user who liked the post in the likes array..
// here we have to pass the comment as well as the detail of the person of posted that comment inside the comment array..
router.put("/comment",requireLogin,(req,res)=>{
    console.log(req.body)
    const comment={
        text:req.body.text, // ye ham front end se fetch kr rahe hain...
        // now we also want the detail of the user who posted this that will be present inside the req.user
        // we have assigned in req.user in the middleware..
        postedby:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment} // front end pr comments key se fetch karenge data ko..
    },{
        new:true // this is done so that we could get the real time updated data from the mongo.
    })
    .populate("comments.postedby","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err)
        {
            console.log(err)
            return res.status(422).json({error:err})
        }else{
            console.log(result)
            res.json(result)
        }
    })
})




module.exports=router // at the last we need to export this router and access it from app.js
// by using requireLogin that is a middleware we will be making that rout a protected resoursce..
// usser will only be able to access that if it has the token..