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

const getParents = async(req,res)=>{
    try{
        const parents = await Parent.find().populate('Student', 'FullName RollNo');
        res.status(200).json(parents);
    }catch(error){
        console.error('Error fetching parents:',error);
        res.status(500).json({message:'Error fetching parents',error:error.message});
    }
};

const deleteParent = async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedParent = await Parent.findByIdAndDelete(id);
        if(!deletedParent){
            return res.status(404).json({message:'Parent not found'});
        }
        res.status(200).json({message:'Parent deleted successfully', parent: deletedParent});
    }catch(error){
        console.error('Error deleting parent:',error);
        res.status(500).json({message:'Error deleting parent',error:error.message});
    }
};

module.exports={createParent, getParents, deleteParent};