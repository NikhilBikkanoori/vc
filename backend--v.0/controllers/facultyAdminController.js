// facultyAdminController.js
const csv = require("csv-parser");
const fs = require("fs");

const Faculty = require("../models/Facultyadmin");  // FacultyAdmin model

// -----------------------------------------------------------
// 1️⃣ CREATE FACULTY (Manual Entry - Single Insert)
// -----------------------------------------------------------
const createFaculty = async (req, res) => {
  try {
    const {
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
      password,
    } = req.body;

    const newFaculty = new Faculty({
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
      password,
    });

    await newFaculty.save();

    res.status(201).json({
      message: "Faculty created successfully",
      faculty: newFaculty,
    });
  } catch (error) {
    console.error("Error creating faculty:", error);
    res
      .status(500)
      .json({ message: "Error creating faculty", error: error.message });
  }
};

// -----------------------------------------------------------
// 2️⃣ UPLOAD CSV (Bulk Insert - Many Faculties)
// Expected CSV Columns:
// name,email,phonenumber,address,facultyId,dob,gender,department,salary,username,password
// -----------------------------------------------------------
const uploadFacultyCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const results = [];
    const validFaculties = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        try {
          for (let i = 0; i < results.length; i++) {
            const f = results[i];

            const {
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
              password,
            } = f;

            // Basic validation
            if (!name || !facultyId || !email || !username || !password) {
              errors.push({
                row: i + 1,
                faculty: name || "Unknown",
                message: "Missing required fields",
              });
              continue;
            }

            validFaculties.push({
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
              password,
            });
          }

          let insertedFaculties = [];

          if (validFaculties.length > 0) {
            insertedFaculties = await Faculty.insertMany(validFaculties, {
              ordered: false,
            });
          }

          fs.unlinkSync(req.file.path); // delete uploaded CSV

          return res.status(200).json({
            message: "CSV processed successfully",
            insertedCount: insertedFaculties.length,
            failedCount: errors.length,
            faculties: insertedFaculties,
            errors,
          });
        } catch (error) {
          console.error("Faculty CSV insert error:", error);
          fs.unlinkSync(req.file.path);
          return res.status(500).json({
            message: "CSV insert failed",
            error: error.message,
          });
        }
      })
      .on("error", (error) => {
        console.error("CSV read error:", error);
        fs.unlinkSync(req.file.path);
        return res.status(500).json({
          message: "Error reading CSV file",
          error: error.message,
        });
      });
  } catch (error) {
    console.error("CSV Upload Error (Faculty):", error);
    return res
      .status(500)
      .json({ message: "CSV upload failed", error: error.message });
  }
};

// -----------------------------------------------------------
// 3️⃣ GET ALL FACULTY
// -----------------------------------------------------------
const getFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching faculties", error: error.message });
  }
};

// -----------------------------------------------------------
// 4️⃣ GET FACULTY BY USERNAME
// -----------------------------------------------------------
const getFacultyByUsername = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ username: req.params.username });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json(faculty);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching faculty", error: error.message });
  }
};

// -----------------------------------------------------------
// 5️⃣ UPDATE FACULTY (PUT)
// -----------------------------------------------------------
const updateFaculty = async (req, res) => {
  try {
    const updated = await Faculty.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res
      .status(200)
      .json({ message: "Faculty updated successfully", faculty: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating faculty", error: error.message });
  }
};

// -----------------------------------------------------------
// 6️⃣ PATCH FACULTY (Partial Update)
// -----------------------------------------------------------
const patchFaculty = async (req, res) => {
  try {
    const patched = await Faculty.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      { new: true }
    );

    if (!patched) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res
      .status(200)
      .json({ message: "Faculty patched successfully", faculty: patched });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error patching faculty", error: error.message });
  }
};

// -----------------------------------------------------------
// 7️⃣ DELETE FACULTY (by username)
// -----------------------------------------------------------
const deleteFaculty = async (req, res) => {
  try {
    const deleted = await Faculty.findOneAndDelete({
      username: req.params.username,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting faculty", error: error.message });
  }
};

// -----------------------------------------------------------
// EXPORT MODULES
// -----------------------------------------------------------
module.exports = {
  createFaculty,
  uploadFacultyCSV,
  getFaculties,
  getFacultyByUsername,
  updateFaculty,
  patchFaculty,
  deleteFaculty,
};