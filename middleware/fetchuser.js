const jwt=require("jsonwebtoken")
const JWT_SECRET="random@@#$123!"

fetchuser=(req,res,next)=>{
    //get the jwt token from req header and add the user id to req .....
    const token=req.header('auth-token')
    // console.log(token)
    if(!token)
    {
        // console.log("inside")
     return   res.status(401).send("Please authenticate using valid token!")

    }
    try{
    const data=jwt.verify(token,JWT_SECRET)
    // console.log(data);
    req.user=data
    next();
    }
    catch(err)
    {
      return   res.status(401).send("Please authenticate using valid token!")

        
    }



}




module.exports=fetchuser
