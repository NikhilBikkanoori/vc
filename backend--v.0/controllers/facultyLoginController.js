const faculty=require('../models/Facultyadmin');
const loginFaculty=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const facultyMember=await faculty.findOne({username,password});
        if(!facultyMember){
            return  res.status(401).json({message:'Username not found'});
        } 
        if(facultyMember.password!==password){
            return res.status(401).json({message:'Incorrect password'});
        }
        res.status(200).json({
            message:'Login successful',
            faculty:{
                id:facultyMember._id,
                FullName:facultyMember.name,
                username:facultyMember.username,
            }});
    }
    catch(error){
        res.status(500).json({message:'Error during login',error:error.message});
    }
}

module.exports = { loginFaculty };