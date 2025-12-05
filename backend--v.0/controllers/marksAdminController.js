const Marks=require('../models/MarksAdmin');
const Student=require('../models/StudentAdmin');

const createMarks =async(req,res)=>{
    try{
        const {StudentRoll,Subject1,Subject1Marks,Subject2,Subject2Marks,Subject3,Subject3Marks,Subject4,Subject4Marks,Subject5,Subject5Marks}=req.body;
        const existingStudent=await Student.findOne({RollNo:StudentRoll});
        if(!existingStudent){
            return res.status(400).json({message:'Associated student not found'});
        }
        const newMarks=new Marks({
            Student:existingStudent._id,
            Subject1,   
            Subject1Marks,      
            Subject2,
            Subject2Marks,  
            Subject3,
            Subject3Marks,  
            Subject4,
            Subject4Marks,
            Subject5,
            Subject5Marks
        });
        await newMarks.save();
        res.status(201).json({message:'Marks created successfully',marks:newMarks});
    }catch(error){
        console.error('Error creating marks:',error);
        res.status(500).json({message:'Error creating marks',error:error.message});
    }
};

const getMarks=async(req,res)=>{
    try{
        const marksList=await Marks.find().populate('Student');     
        res.status(200).json(marksList);
    }   
    catch(error){   
        console.error('Error fetching marks:',error);
        res.status(500).json({message:'Error fetching marks',error:error.message});
    }
};

module.exports={createMarks,getMarks};