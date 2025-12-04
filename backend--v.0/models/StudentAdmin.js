const mongoose = require('mongoose');

const StudentAdminSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
    },
    RollNo: {
        type: String,
        required: true,
        unique: true    
    },
    Email:{
        type: String,
        required: true,
        unique: true    
    },
    Phone:{
        type:Number,
        required:true,
        unique:true 
    },
    DateOfBirth:{
        type: Date,
        required: true  
    },
    Gender:{
        type: String,
        required: true  
    },
    Department:{
        type: String,
        required: true  
    },
    Address:{
        type:String,
        required:true
    },
    Parent:{
        type:String,
        required:true 
    },
    Username:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('StudentAdmin', StudentAdminSchema);