const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const studentAdminRoutes = require('./routes/studentAdminRoutes');
const studentLoginRoutes = require('./routes/studentLoginRoutes');
const parentAdminRoutes = require('./routes/parentAdminRoutes');
const feesAdminRoutes = require('./routes/feesAdminRoutes');
const parentLoginRoutes = require('./routes/parentLoginRoutes');
const marksAdminRoutes = require('./routes/marksAdminRoutes');
const facultyLoginRoutes = require('./routes/facultyLoginRoutes');
const facultyRoutes =require('./routes/facultyRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/student-admin', studentAdminRoutes);
app.use('/api/student-login', studentLoginRoutes);
app.use('/api/parent-admin', parentAdminRoutes);
app.use('/api/fees-admin', feesAdminRoutes);
app.use('/api/parent-login', parentLoginRoutes);
app.use('/api/marks-admin', marksAdminRoutes);
app.use('/api/faculty-login', facultyLoginRoutes);
app.use('/api/faculty-admin', facultyRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))    
.catch(err => console.error('Could not connect to MongoDB...', err))

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});