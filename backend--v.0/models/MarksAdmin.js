const mongoose = require('mongoose');

const MarksAdminSchema = new mongoose.Schema({
    Student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StudentAdmin', 
        required:true
    },
    Subject1:{
        type:String,
        required:true
    },
    Subject1Marks:{
        type:Number,
        required:true
    },
    Subject2:{
        type:String,
        required:true
    },
    Subject2Marks:{
        type:Number,
        required:true
    },Subject3:{
        type:String,
        required:true
    },
    Subject3Marks:{
        type:Number,
        required:true
    },Subject4:{
        type:String,
        required:true
    },
    Subject4Marks:{
        type:Number,
        required:true
    },Subject5  :{
        type:String,
        required:true
    },
    Subject5Marks:{
        type:Number,
        required:true
    },
});
module.exports = mongoose.model('MarksAdmin', MarksAdminSchema);