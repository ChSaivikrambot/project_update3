import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Only import once at the top level
// index.js or App.js
import './index.css'; // Or './App.css' depending on your setup

// Landing Page
import Landing from "./components/Landing"; // ✅ correctly imported

// Public Components
import UserSelection from "./components/UserSelection";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import AttendanceManagementSystem from './AttendanceManegementSystem';
// Student Components
import StudentDashboard from "./components/StudentDashboard";
import Timetable from "./components/Timetable";
// Importing it
import { ProfileEdit } from './components/ProfileEdit';
// Teacher Components
import TeacherDashboard from "./components/TeacherDashboard";
import MarkAttendance from "./components/MarkAttendance";
import ViewAttendance from "./components/ViewAttendance";
import ViewClasses from "./components/ViewClasses";
// Auth Wrapper
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider> {/* ThemeProvider wraps the entire app to manage dark mode */}
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Routes */}
          <Route path="/user-selection" element={<UserSelection />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Student Routes */}
          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/student/timetable" element={<Timetable />} />

          {/* Teacher Routes */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/mark-attendance"
            element={
              <ProtectedRoute>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />
          <Route path="/AttendanceManagementSystem" element={<AttendanceManagementSystem />} />
          <Route
            path="/teacher/view-students"
            element={
              <ProtectedRoute>
                <ViewAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/view-classes"
            element={
              <ProtectedRoute>
                <ViewClasses />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/edit/:teacherId" element={<ProfileEdit />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
