const mongoose = require('mongoose');

const studentMarksSchema = new mongoose.Schema({
    studentId: {
    type: String,
    ref: "Student",
    required: true
  },
  subject1: String,
  subject2: String,
  subject3: String,
  subject4: String,
  subject5: String,
  marks1: Number,
  marks2: Number,
  marks3: Number,
  marks4: Number,
  marks5: Number
});
module.exports = mongoose.model('StudentMarks', studentMarksSchema);