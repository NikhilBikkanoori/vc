const mongoose = require('mongoose');

const ParentAdminSchema = new mongoose.Schema({
    FullName: {
        type: String,
        required: true
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
    Address:{
        type:String,
        required:true
    },
    Student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StudentAdmin',
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
module.exports = mongoose.model('ParentAdmin', ParentAdminSchema);