const Parent = require('../models/ParentAdmin');

const parentLogin = async (req, res) => {
    try {
        const { Username, Password } = req.body;

        // Step 1: Check if username exists
        const parent = await Parent.findOne({ Username });
        if (!parent) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        // Step 2: Check password
        if (parent.Password !== Password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Step 3: Success
        res.status(200).json({
            message: 'Login successful',
            parent
        });

    } catch (error) {
        console.error('Error during parent login:', error);
        res.status(500).json({
            message: 'Server error during parent login',
            error: error.message
        });
    }
};
module.exports = { parentLogin };