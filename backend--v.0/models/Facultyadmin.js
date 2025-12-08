const mongoose = require('mongoose');
const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    facultyId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phonenumber: {
        type: String,
        required: true,    
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true  
    },
    salary: {
        type: Number,
        required: true  
    },
    username: {
        type: String,
        required: true,
        unique: true    
    },
    password: {
        type: String,
        required: true    
    }
}, { timestamps: true });

module.exports = mongoose.model('FacultyAdmin', facultySchema);    
