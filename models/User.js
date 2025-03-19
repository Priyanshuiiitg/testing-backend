const mongoose =require('mongoose')
const {Schema}=mongoose//important line for tackling the error 
// const userSchema=new Schema({
//     ^

// ReferenceError: Schema is not defined


const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true

    },
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now

    }

})

module.exports=mongoose.model('user',userSchema);