const csv = require("csv-parser");
const fs = require("fs");

const Student = require('../models/StudentAdmin');
const Faculty = require('../models/Facultyadmin');


// -----------------------------------------------------------
// 1️⃣ CREATE STUDENT (Manual Entry - Single Insert)
// -----------------------------------------------------------
const createStudent = async (req, res) => {
    try {
        const {
            FullName, RollNo, Email, Phone, DateOfBirth, Gender,
            Department, Address, Parent, MentorRoll, Username, Password
        } = req.body;

        // Validate mentor based on MentorRoll
        const existingFaculty = await Faculty.findOne({ facultyId: MentorRoll });

        if (!existingFaculty) {
            return res.status(400).json({ message: 'Associated mentor not found' });
        }

        const newStudent = new Student({
            FullName,
            RollNo,
            Email,
            Phone,
            DateOfBirth,
            Gender,
            Department,
            Address,
            Parent,
            Mentor: existingFaculty._id,
            Username,
            Password
        });

        await newStudent.save();

        res.status(201).json({
            message: 'Student created successfully',
            student: newStudent
        });

    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Error creating student', error: error.message });
    }
};



// -----------------------------------------------------------
// 2️⃣ UPLOAD CSV (Bulk Insert - Many Students)
// -----------------------------------------------------------
const uploadStudentCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No CSV file uploaded" });
        }

        const results = [];
        const validStudents = [];
        const errors = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (row) => results.push(row))
            .on("end", async () => {
                try {
                    for (let i = 0; i < results.length; i++) {
                        const s = results[i];

                        // Mentor validation
                        const mentor = await Faculty.findOne({ facultyId: s.MentorRoll });

                        if (!mentor) {
                            errors.push({
                                row: i + 1,
                                student: s.FullName,
                                message: `Mentor with roll ${s.MentorRoll} not found`,
                            });
                            continue;
                        }

                        validStudents.push({
                            FullName: s.FullName,
                            RollNo: s.RollNo,
                            Email: s.Email,
                            Phone: s.Phone,
                            DateOfBirth: s.DateOfBirth,
                            Gender: s.Gender,
                            Department: s.Department,
                            Address: s.Address,
                            Parent: s.Parent,
                            Mentor: mentor._id,
                            Username: s.Username,
                            Password: s.Password,
                        });
                    }

                    let insertedStudents = [];

                    if (validStudents.length > 0) {
                        insertedStudents = await Student.insertMany(validStudents, { ordered: false });
                    }

                    // Delete uploaded file
                    fs.unlinkSync(req.file.path);

                    return res.status(200).json({
                        message: "CSV processed successfully",
                        insertedCount: insertedStudents.length,
                        failedCount: errors.length,
                        students: insertedStudents, // ✔ matches frontend
                        errors,
                    });

                } catch (error) {
                    console.error("Insert error:", error);
                    fs.unlinkSync(req.file.path);
                    return res.status(500).json({
                        message: "CSV insert failed",
                        error: error.message,
                    });
                }
            });

    } catch (error) {
        console.error("CSV Upload Error:", error);
        return res.status(500).json({ message: "CSV upload failed", error });
    }
};




// -----------------------------------------------------------
// 3️⃣ GET ALL STUDENTS
// -----------------------------------------------------------
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().populate("Mentor");
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
};


// -----------------------------------------------------------
// 4️⃣ DELETE STUDENT
// -----------------------------------------------------------
const deleteStudent = async (req, res) => {
    console.log("Delete request for RollNo:", req.params.rollno);
    try {
        const deleted = await Student.findOneAndDelete({ RollNo: req.params.rollno });

        if (!deleted) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error: error.message });
    }
};


// -----------------------------------------------------------
// 5️⃣ UPDATE STUDENT (PUT)
// -----------------------------------------------------------
const updateStudent = async (req, res) => {
    try {
        const updated = await Student.findOneAndUpdate(
            { RollNo: req.params.rollno },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', student: updated });

    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error: error.message });
    }
};


// -----------------------------------------------------------
// 6️⃣ PATCH STUDENT
// -----------------------------------------------------------
const patchStudent = async (req, res) => {
    try {
        const patched = await Student.findOneAndUpdate(
            { RollNo: req.params.rollno },
            req.body,
            { new: true }
        );

        if (!patched) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student patched successfully', student: patched });

    } catch (error) {
        res.status(500).json({ message: 'Error patching student', error: error.message });
    }
};


// -----------------------------------------------------------
// 7️⃣ GET STUDENT BY USERNAME
// -----------------------------------------------------------
const getStudentByUsername = async (req, res) => {
    try {
        const student = await Student.findOne({ Username: req.params.username });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching student', error: error.message });
    }
};


module.exports = {
    createStudent,
    uploadStudentCSV,
    getStudents,
    deleteStudent,
    updateStudent,
    patchStudent,
    getStudentByUsername
};