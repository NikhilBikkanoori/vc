const Fees=require('../models/FeesAdmin');
const Student=require('../models/StudentAdmin');

const createFees=async(req,res)=>{
    try{
        const {StudentRoll,Amount,Paid}=req.body;   
        const existingStudent=await Student.findOne({RollNo:StudentRoll});
        if(!existingStudent){
            return res.status(400).json({message:'Associated student not found'});
        }
        const newFees=new Fees({
            Student:existingStudent._id,
            Amount,
            Paid
        });;
        await newFees.save();
        res.status(201).json({message:'Fees record created successfully',fees:newFees});
    }catch(error){
        console.error('Error creating fees record:',error);
        res.status(500).json({message:'Error creating fees record',error:error.message});
    }   
};
module.exports={createFees};