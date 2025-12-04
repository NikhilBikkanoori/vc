const Student=require('../models/StudentAdmin');

const createStudent=async(req,res)=>{
    try{
        const {FullName,RollNo,Email,Phone,DateOfBirth,Gender,Department,Address,Parent,Username,Password}=req.body;
        const newStudent=new Student({
            FullName,       
            RollNo,
            Email,
            Phone,
            DateOfBirth,    
            Gender,
            Department,
            Address,    
            Parent,
            Username,
            Password    
        });
        await newStudent.save();
        res.status(201).json({message:'Student created successfully',student:newStudent});
    }catch(error){
        console.error('Error creating student:',error);
        res.status(500).json({message:'Error creating student',error:error.message});
    }
};

const getStudents=async(req,res)=>{
    try{
        const students=await Student.find();    
        res.status(200).json(students);
    }catch(error){
        console.error('Error fetching students:',error);
        res.status(500).json({message:'Error fetching students',error:error.message});
    }
};

const deleteStudent=async(req,res)=>{
    try{
        const myStudent=await Student.findOneAndDelete({RollNo:req.params.rollno});
        if(!myStudent){
            return res.status(404).json({message:'Student not found'});
        }
        res.status(200).json({message:'Student deleted successfully'});
    }catch(error){
        console.error('Error deleting student:',error);
        res.status(500).json({message:'Error deleting student',error:error.message});
    }
};

const updateStudent=async(req,res)=>{
    try{
        const myStudent=await Student.findOneAndUpdate({RollNo:req.params.rollno},req.body,{new:true});
        if(!myStudent){
            return res.status(404).json({message:'Student not found'});
        }   
        res.status(200).json({message:'Student updated successfully',student:myStudent});
    }catch(error){
        console.error('Error updating student:',error);
        res.status(500).json({message:'Error updating student',error:error.message});
    }   
};

const patchStudent=async(req,res)=>{
    try{
        const myStudent=await Student.findOneAndUpdate({RollNo:req.params.rollno},req.body,{new:true});     
        if(!myStudent){
            return res.status(404).json({message:'Student not found'});
        }   
        res.status(200).json({message:'Student patched successfully',student:myStudent});
    }catch(error){
        console.error('Error patching student:',error);
        res.status(500).json({message:'Error patching student',error:error.message});
    }
};


module.exports={createStudent, getStudents, deleteStudent, updateStudent, patchStudent};