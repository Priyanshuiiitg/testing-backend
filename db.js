const mongoose = require('mongoose');
// const URI="mongodb://0.0.0.0:27017/skynote?readPreference=primary&directConnection=true";
const URI='mongodb+srv://priyanshu:who%40is%40priyanshu@cluster0.dl0gz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
async function connectToDatabase() {
  try {
    await mongoose.connect(URI);
    console.log('Connected to the database');
    // Continue with your code here
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

module.exports =connectToDatabase;
