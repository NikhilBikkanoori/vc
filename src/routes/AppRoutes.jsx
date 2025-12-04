import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import StudentLogin from '../pages/StudentLogin';
import MentorLogin from '../pages/MentorLogin';
import ParentLogin from '../pages/ParentLogin';
import Dashboard from '../pages/Dashboard';
import MentorDashboard from '../pages/MentorDashboard';
import ParentDashboard from '../pages/ParentDashboard';
import Admin from '../pages/Admin';
import Counseling from '../pages/Counseling';
import StudentProfile from '../pages/studentProfile';
import MentorProfile from '../pages/MentorProfile';
import AddStudent from "../pages/AddStudent";
import ManageUsers from '../pages/ManageUsers.';
import AdminPanel from '../pages/Admin';
import Display from '../pages/display';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/student-login" element={<StudentLogin />} />
      <Route path="/mentor-login" element={<MentorLogin />} />
      <Route path="/parent-login" element={<ParentLogin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/counseling" element={<Counseling />} />
      <Route path="/mentor-dashboard" element={<MentorDashboard />} />
      <Route path="/parent-dashboard" element={<ParentDashboard />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/StudentProfile" element={<StudentProfile />} />
      <Route path="/MentorProfile" element={<MentorProfile />} />
      <Route path="/add-student" element={<AddStudent />} />
      <Route path="/manageuser" element={<ManageUsers />} />
      <Route path="/display" element={<Display />} />
    </Routes>
  );
}

export default AppRoutes;