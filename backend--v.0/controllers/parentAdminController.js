const Parent=require('../models/ParentAdmin');
const Student=require('../models/StudentAdmin');

const createParent =async(req,res)=>{
    try{
        const {FullName,Email,Phone,Address,StudentRoll,Username,Password}=req.body;
        const existingStudent=await Student.findOne({RollNo:StudentRoll});
        if(!existingStudent){
            return res.status(400).json({message:'Associated student not found'});
        }
        const newParent=new Parent({
            FullName,
            Email,
            Phone,  
            Address,
            Student:existingStudent._id,
            Username,   
            Password    
        });
        await newParent.save();
        res.status(201).json({message:'Parent created successfully',parent:newParent});
    }catch(error){
        console.error('Error creating parent:',error);
        res.status(500).json({message:'Error creating parent',error:error.message});
    }
};
module.exports={createParent};