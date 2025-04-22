import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Dashboard from './pages/AdminDashboard';  // Admin Dashboard page
import NotFound from './pages/NotFound';  // 404 Page
import LoginNew from './pages/LoginNew';  // Login Page
import TimetableUpdate from './pages/TimetableUpdate';  // Timetable Update page

// Protected route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/" />;  // Redirect to login if no token
};

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<LoginNew />} />
          
          {/* Protected Admin Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          {/* Protected Timetable Update Page */}
          <Route
            path="/timetable-update"
            element={
              <PrivateRoute>
                <TimetableUpdate />
              </PrivateRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
