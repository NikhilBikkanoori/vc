const mongoose= require('mongoose');

const FeesAdminSchema=new mongoose.Schema({
    Student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'StudentAdmin',
        required:true
    },
    Amount:{
        type:Number,
        required:true
    },
    Paid:{
        type:Number,
        required:true
    }
});

module.exports= mongoose.model('FeesAdmin', FeesAdminSchema);