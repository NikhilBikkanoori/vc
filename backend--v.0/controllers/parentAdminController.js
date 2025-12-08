// parentAdminController.js
const csv = require("csv-parser");
const fs = require("fs");

const Parent = require("../models/ParentAdmin");      // your ParentAdmin model
const Student = require("../models/StudentAdmin");    // your StudentAdmin model

// -----------------------------------------------------------
// 1️⃣ CREATE PARENT (Manual Entry - Single Insert)
// -----------------------------------------------------------
const createParent = async (req, res) => {
  try {
    const {
      FullName,
      Email,
      Phone,
      Address,
      StudentRollNo,   // RollNo of the student (from StudentAdmin)
      Username,
      Password,
    } = req.body;

    // Find the student by RollNo
    const existingStudent = await Student.findOne({ RollNo: StudentRollNo });

    if (!existingStudent) {
      return res
        .status(400)
        .json({ message: "Associated student not found for given RollNo" });
    }

    const newParent = new Parent({
      FullName,
      Email,
      Phone,
      Address,
      Student: existingStudent._id,
      Username,
      Password,
    });

    await newParent.save();

    res.status(201).json({
      message: "Parent created successfully",
      parent: newParent,
    });
  } catch (error) {
    console.error("Error creating parent:", error);
    res
      .status(500)
      .json({ message: "Error creating parent", error: error.message });
  }
};

// -----------------------------------------------------------
// 2️⃣ UPLOAD CSV (Bulk Insert - Many Parents)
// -----------------------------------------------------------
const uploadParentCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const results = [];
    const validParents = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        try {
          for (let i = 0; i < results.length; i++) {
            const p = results[i];

            // Expecting CSV columns:
            // FullName,Email,Phone,Address,StudentRollNo,Username,Password
            const {
              FullName,
              Email,
              Phone,
              Address,
              StudentRollNo,
              Username,
              Password,
            } = p;

            // Validate associated student
            const student = await Student.findOne({ RollNo: StudentRollNo });

            if (!student) {
              errors.push({
                row: i + 1,
                parent: FullName,
                message: `Student with RollNo ${StudentRollNo} not found`,
              });
              continue;
            }

            validParents.push({
              FullName,
              Email,
              Phone,
              Address,
              Student: student._id,
              Username,
              Password,
            });
          }

          let insertedParents = [];

          if (validParents.length > 0) {
            insertedParents = await Parent.insertMany(validParents, {
              ordered: false,
            });
          }

          // Delete uploaded file
          fs.unlinkSync(req.file.path);

          return res.status(200).json({
            message: "CSV processed successfully",
            insertedCount: insertedParents.length,
            failedCount: errors.length,
            parents: insertedParents,
            errors,
          });
        } catch (error) {
          console.error("Parent CSV insert error:", error);
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
    console.error("CSV Upload Error (Parent):", error);
    return res
      .status(500)
      .json({ message: "CSV upload failed", error: error.message });
  }
};

// -----------------------------------------------------------
// 3️⃣ GET ALL PARENTS
// -----------------------------------------------------------
const getParents = async (req, res) => {
  try {
    // populate associated student details
    const parents = await Parent.find().populate("Student");
    res.status(200).json(parents);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching parents", error: error.message });
  }
};

// -----------------------------------------------------------
// 4️⃣ DELETE PARENT (by Username)
// -----------------------------------------------------------
const deleteParent = async (req, res) => {
  console.log("Delete request for Parent Username:", req.params.username);
  try {
    const deleted = await Parent.findOneAndDelete({
      Username: req.params.username,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json({ message: "Parent deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting parent", error: error.message });
  }
};

// -----------------------------------------------------------
// 5️⃣ UPDATE PARENT (PUT) by Username
// -----------------------------------------------------------
const updateParent = async (req, res) => {
  try {
    const updated = await Parent.findOneAndUpdate(
      { Username: req.params.username },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res
      .status(200)
      .json({ message: "Parent updated successfully", parent: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating parent", error: error.message });
  }
};

// -----------------------------------------------------------
// 6️⃣ PATCH PARENT by Username
// -----------------------------------------------------------
const patchParent = async (req, res) => {
  try {
    const patched = await Parent.findOneAndUpdate(
      { Username: req.params.username },
      req.body,
      { new: true }
    );

    if (!patched) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res
      .status(200)
      .json({ message: "Parent patched successfully", parent: patched });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error patching parent", error: error.message });
  }
};

// -----------------------------------------------------------
// 7️⃣ GET PARENT BY USERNAME
// -----------------------------------------------------------
const getParentByUsername = async (req, res) => {
  try {
    const parent = await Parent.findOne({
      Username: req.params.username,
    }).populate("Student");

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json(parent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching parent", error: error.message });
  }
};

module.exports = {
  createParent,
  uploadParentCSV,
  getParents,
  deleteParent,
  updateParent,
  patchParent,
  getParentByUsername,
};