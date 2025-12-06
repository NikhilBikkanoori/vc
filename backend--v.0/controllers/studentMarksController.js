const marks= require('../models/studentMarks');
// Add Student Marks
const addStudentMarks=async(req,res)=>{
    try{
        const {studentId,subject1,subject2,subject3,subject4,subject5,marks1,marks2,marks3,marks4,marks5    }=req.body;
        const newMarks=new marks({
            studentId,
            subject1,
            subject2,
            subject3,
            subject4,
            subject5,
            marks1,
            marks2,
            marks3,
            marks4,
            marks5
        });
        await newMarks.save();
        res.status(201).json({message:'Student marks added successfully',marks:newMarks});
    }
    catch(error){
        res.status(500).json({message:'Error adding student marks',error:error.message});
    }
}
// Get All Student Marks
const getAllStudentMarks=async(req,res)=>{
    try{
        const allMarks=await marks.find().populate('studentId');
        res.status(200).json(allMarks);
    }
    catch(error){
        res.status(500).json({message:'Error fetching student marks',error:error.message});
    }

}
// Get Student Marks by ID
const getStudentMarksById=async(req,res)=>{
    try{    
        const {id}=req.params;
        const studentMarks=await marks.findById(id).populate('studentId');
        if(!studentMarks){
            return res.status(404).json({message:'Student marks not found'});
        }
        res.status(200).json(studentMarks);
    }
    catch(error){
        res.status(500).json({message:'Error fetching student marks',error:error.message});
    }
}

// Update Student Marks by ID
const updateStudentMarks=async(req,res)=>{
    try{
        const {id}=req.params;
        const updatedMarks=await marks.findByIdAndUpdate(id,req.body,{new:true});
        if(!updatedMarks){
            return res.status(404).json({message:'Student marks not found'});
        }
        res.status(200).json(updatedMarks);
    }
    catch(error){
        res.status(500).json({message:'Error updating student marks',error:error.message});
    }
}
// Delete Student Marks by ID
const deleteStudentMarks=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedMarks=await marks.findByIdAndDelete(id);
        if(!deletedMarks){
            return res.status(404).json({message:'Student marks not found'});
        }
        res.status(200).json({message:'Student marks deleted successfully'});
    }
    catch(error){
        res.status(500).json({message:'Error deleting student marks',error:error.message});
    }
}

module.exports={
    addStudentMarks,
    getAllStudentMarks,
    getStudentMarksById,
    updateStudentMarks,
    deleteStudentMarks
}