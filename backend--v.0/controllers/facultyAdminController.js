const faculty=require('../models/Facultyadmin');
const addFaculty=async(req,res)=>{
    try{
        const {name,facultyId,email,phonenumber,dob,gender,address,department,salary,username,password}=req.body;
        const newFaculty=new faculty({
            name,
            facultyId,
            email,
            phonenumber,
            dob,
            gender,
            address,
            department,
            salary,
            username,
            password
        }); 
        await newFaculty.save();
        res.status(201).json({message:'Faculty member added successfully',faculty:newFaculty});
    }
    catch(error){
        res.status(500).json({message:'Error adding faculty member',error:error.message});
    }
}

const getFaculty=async(req,res)=>{
    try{
        const faculties=await faculty.find();
        res.status(200).json(faculties);
    }
    catch(error){
        res.status(500).json({message:'Error fetching faculty members',error:error.message});
    }
}
const getFacultyById=async(req,res)=>{
    try{
        const facultyId=req.params.id;
        const facultyMember=await faculty.findOne({facultyId:facultyId});
        if(!facultyMember){
            return res.status(404).json({message:'Faculty member not found'});
        }
        res.status(200).json(facultyMember);
    }
    catch(error){
        res.status(500).json({message:'Error fetching faculty member',error:error.message});
    }
}
const updateFaculty=async(req,res)=>{
    try{
        const facultyId=req.params.id;
        const updates=req.body;
        const updatedFaculty=await faculty.findOneAndUpdate({facultyId:facultyId},updates,{new:true});
        if(!updatedFaculty){
            return res.status(404).json({message:'Faculty member not found'});
        }
        res.status(200).json(updatedFaculty);
    }
    catch(error){
        res.status(500).json({message:'Error updating faculty member',error:error.message});
    }
}
const deleteFaculty=async(req,res)=>{
    try{
        const facultyId=req.params.id;
        const deletedFaculty=await faculty.findOneAndDelete({facultyId:facultyId});
        if(!deletedFaculty){
            return res.status(404).json({message:'Faculty member not found'});
        }       
        res.status(200).json({message:'Faculty member deleted successfully'});
    }
    catch(error){
        res.status(500).json({message:'Error deleting faculty member',error:error.message});
    }
}
module.exports={addFaculty,getFaculty,getFacultyById,updateFaculty,deleteFaculty};  