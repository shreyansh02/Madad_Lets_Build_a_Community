const express=require('express');
const app=express(); // this will initialise our application..\
const mongoose=require('mongoose');
const PORT=process.env.PORT || 5000;
// process.env.PORT-> this is added when we are at the production side..now we cant make the port static heroku will automatically choose the port number which is available..
const {MONGOURI}=require("./config/keys")
//console.log(MONGOURI)
mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true 
}); // we have to pass the uri in it that we have define inside a js object in keys.js
mongoose.connection.on('connected',()=>
{
    console.log("when we are succesfully connected with mongo this call back function will be triggered..");
})
mongoose.connection.on('error',(err)=>
{
    console.log("error occcured in connection the error is ",err);
})

require('./models/user') // we require taht bcz structure of user is defined in user.js
require('./models/post') // this has the model for our post...
app.use(express.json()) // we need to pass our request to json..
app.use(require('./routes/auth')) // auth.js has sign-up and sign-in route
app.use(require('./routes/post')) // this will contain the routes for the post..
app.use(require('./routes/user')) // this will also contain routes


// this part is only used for the deploying to heroku we are moving to the production side..
if(process.env.NODE_ENV=="production")
{
    // if our project is deployed then we have to do something....
    app.use(express.static('client/build')) // firstly we have to serve the static file prsent inside the build folder
    const path=require('path') // we have to require the model...
    app.get("*",(req,res)=>{
        // if the user will make any request...
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}



app.listen(PORT,()=>{
    console.log("the server is running on the port ",PORT);
})


/**
 * const customMiddleware=(req,res,next)=>
{
    console.log("Middle ware is executed and if we want the next code to be executed we need to call next");
    next()
}
// app.use(customMiddleware) middleware will be executed for all the routes..
/*
app.get("/",function(req,res)
{
    res.send("Hello wrold..")
})
app.get("/",(req,res)=>{
    res.send("hello world..");
})
app.get("/about",customMiddleware,(req,res)=>{
    console.log("About page we are talking...")
    res.send("About Page..");
})



/*
instead of this normal fucntion we should use arrow function 
app.listen(3000,function()
{
    console.log("the seerver is running on the port no 3000");
})*/