const Student = require('../models/StudentAdmin');

const studentLogin = async (req, res) => {
    try {
        const { Username, Password } = req.body;

        // Step 1: Check if username exists
        const student = await Student.findOne({ Username });
        if (!student) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        // Step 2: Check password
        if (student.Password !== Password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Step 3: Success
        res.status(200).json({
            message: 'Login successful',
            student
        });

    } catch (error) {
        console.error('Error during student login:', error);
        res.status(500).json({
            message: 'Server error during student login',
            error: error.message
        });
    }
};
module.exports = { studentLogin };