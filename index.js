const connectToDatabase=require('./db')
connectToDatabase();

const express=require('express')
const app=express();
const cors=require('cors')
app.use(cors());
// app.get('/',(req,res)=>{
//     // res.send("Hello world! My name is Priyanshu Shukla");
//     res.sendFile(__dirname+"/index.html");

// })
app.use(express.json())
app.use("/api/auth",require('./routes/auth'))
app.use('/api/notes',require("./routes/notes"))

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})