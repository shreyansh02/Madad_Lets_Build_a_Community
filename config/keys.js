if(process.env.NODE_ENV==="production")
{
    module.exports=require('./prod')
}
else{
    module.exports=require('./dev')
}

/*
1-> initially when we have started the porject we are on the development side and we dont have any
dev.js and prod.js.
2-> now when we are going on the production side we have created dev.js and prod.js(here environment variable is used)
3-> now in the keys.js we will have to export dev and prod depending on the condition that whether we
are on the production side or at the development side...
module.exports={
    MONGOURI:"mongodb+srv://parag_pramod_roy:H4kjYuWrzLTqXHTC@cluster0.d6izn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    JWT_SECRET:"eedbhsngfbfhe4"
}
//H4kjYuWrzLTqXHTC*/