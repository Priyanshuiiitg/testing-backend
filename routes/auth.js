const express=require('express')
const router=express.Router();
const User=require('../models/User')
const {body,validationResult}=require("express-validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const JWT_SECRET="random@@#$123!"
const fetchuser=require('../middleware/fetchuser')
//create a new user : POST request @ "/api/auth/signUp".No login is required
router.post('/signUp',[
    body('name').isLength({min:3}),
    body("emailId").isEmail(),
    body('userName').isLength({min:6}),
    body("password").isLength({min:6})
    


],async (req,res)=>{
   let success=false;
    try{

    const errors=validationResult(req);
    //if there are errors then return the bad request and all errors
    if(!errors.isEmpty())
    {
        return res.status(400).json({success:success,errors:errors.array()})
    }
const salt=await bcrypt.genSalt(3);
const secPass=await bcrypt.hash(req.body.password,salt);
   User.create({
    name:req.body.name,
    userName:req.body.userName,
    emailId:req.body.emailId,
password:secPass

   }).then(user=>{
    success=true;

    const authToken=jwt.sign(user.id,JWT_SECRET)
   return res.json({success:success,authToken:authToken,user:user.id})
    


   }).catch(err=>{
    const terms=['userName','emailId']
    const val=err.keyValue
    if(val.hasOwnProperty('userName'))
    {
        // res.send("UserName already exists!")
     return   res.status(400).json({success:success,message:"UserName already exists!"})
    }
    else if(val.hasOwnProperty('emailId'))
    {
      return  res.status(400).json({success:success,message:"EmailId already exists"})
    }
    else
    {
      return  res.json({success:success,message:"Unkown error!!"})
    }

   })
//one alternative : .then(user=>res.json(user)).catch(err=>res.json({error:err,hell:err.message}))
    }
    catch(err)
    {
      return   res.status(500).send({success:success,message:"Some error occured!"});
    }



})


//
router.post('/login',
body('userName').notEmpty().withMessage("Username is required!!"),
body('password').notEmpty().withMessage("Password is required!!")
,async (req,res)=>{
    let success=false;
    try{
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
      return   res.status(400).json({success:success,message:errors.array()})
    }
    const reqVal=req.body;
    const obj=await User.findOne({userName:reqVal.userName})
  //  console.log(obj)
    if(!obj)
    {
          return   res.status(400).json({success:success,message:"Invalid Credentials"})
    }

    // console.log(reqVal.password);
    // console.log(obj.password)
    bcrypt.compare(reqVal.password,obj.password,(err,isMatch)=>{
        console.log(isMatch)
        if(err){
        return    res.send(err)

        }
        if(isMatch)
        {
            success=true
            // res.status(200).send("Login successful!!")
            const authToken=jwt.sign(obj.id,JWT_SECRET);
   return          res.json({success:success,authToken:authToken,user:obj.id})
        }
        else
        {
        return     res.status(400).send({success:success,message:"Login failed!"})
        }
    })
    }
    catch(err)
    {
      return  res.status(500).json({success:success,message:"Internal Server error!"})
    }
    



})

//POST ROUTER 3 : getting user details of logged in user ... Login is required 
router.post('/getUser',fetchuser,async (req,res)=>{
    // res.send(req.user);
    try{
    const user=await User.findById(req.user,'-password')
   return res.send(user);
    }
    catch(err)
    {
      return   res.status(500).send("Internal server error");
    }


})











module.exports=router