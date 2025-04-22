import React from 'react';
import { ArrowRight, Check, X, Circle } from 'lucide-react';

export default function AttendanceManagementSystem() {
  return (
    <div className="bg-gray-100 p-8 min-h-screen">
      {/* Header */}
      <div className="bg-blue-600 text-white text-center p-6 rounded-lg mb-10 shadow-lg">
        <h1 className="text-3xl font-bold">College Attendance Management System</h1>
      </div>

      <div className="flex flex-col items-center">
        {/* Start */}
        <div className="bg-gray-700 text-white px-6 py-3 rounded-md shadow-md mb-6">
          <p className="font-semibold">START</p>
        </div>

        {/* Arrow */}
        <div className="h-8 flex items-center justify-center">
          <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-700"></div>
        </div>

        {/* Home Page */}
        <div className="bg-blue-400 text-white px-8 py-4 rounded-md shadow-md mb-6">
          <p className="font-semibold">Home Page</p>
        </div>

        {/* Branches from Home */}
        <div className="flex w-full justify-center mb-4">
          <div className="border-t-2 border-black w-4/5"></div>
        </div>

        <div className="flex justify-center w-full mb-10 space-x-8 md:space-x-16">
          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-300 text-gray-800 px-6 py-3 rounded-md shadow-md">
              <p>Features</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-300 text-gray-800 px-6 py-3 rounded-md shadow-md">
              <p>How It Works</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-300 text-gray-800 px-6 py-3 rounded-md shadow-md">
              <p>About</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-300 text-gray-800 px-6 py-3 rounded-md shadow-md">
              <p>Contact Us</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-green-400 text-white px-6 py-4 rounded-md shadow-md">
              <p>User Selection Page</p>
            </div>
          </div>
        </div>

        {/* User Selection branches */}
        <div className="flex w-full justify-center mb-4">
          <div className="border-t-2 border-black w-2/3 md:w-4/5"></div>
        </div>

        <div className="flex justify-center w-full mb-6 space-x-12 md:space-x-32">
          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md">
              <p>Student</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-red-500 text-white px-6 py-3 rounded-md shadow-md">
              <p>Teacher</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-purple-700 text-white px-6 py-3 rounded-md shadow-md">
              <p>Admin</p>
            </div>
          </div>
        </div>

        {/* Login/Validate Flow */}
        <div className="flex justify-center w-full mb-6 space-x-12 md:space-x-32">
          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md mb-6">
              <p>Login / Signup</p>
            </div>
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md mb-6">
              <p>Validate with DB</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md mb-6">
              <p>Login / Signup</p>
            </div>
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-blue-500 text-white px-6 py-3 rounded-md shadow-md mb-6">
              <p>Validate with DB</p>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-purple-700 text-white px-6 py-3 rounded-md shadow-md mb-6">
              <p>Admin Login</p>
            </div>
            <div className="h-8 border-l-2 border-black"></div>
            <div className="bg-purple-700 text-white px-6 py-3 rounded-md shadow-md mb-6" id="admin-dashboard">
              <p>Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        <div className="flex justify-center w-full space-x-12 md:space-x-32 mb-10">
          <div className="flex w-64 justify-between">
            <div className="flex flex-col items-center">
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md mb-6">
                <p>If Valid</p>
              </div>
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md" id="student-dashboard-small">
                <p>Student Dashboard</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md mb-6">
                <p>If Invalid</p>
              </div>
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md">
                <p>Error</p>
              </div>
            </div>
          </div>

          <div className="flex w-64 justify-between">
            <div className="flex flex-col items-center">
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md mb-6">
                <p>If Valid</p>
              </div>
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-orange-500 text-white px-4 py-2 rounded-md shadow-md" id="teacher-dashboard-small">
                <p>Teacher Dashboard</p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md mb-6">
                <p>If Invalid</p>
              </div>
              <div className="h-8 border-l-2 border-black"></div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md">
                <p>Error</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Connection Lines */}
        <div className="relative w-full h-32 mb-6">
          {/* Student Dashboard Connection */}
          <div className="absolute top-0 left-1/4 transform -translate-x-1/2 border-l-2 border-dashed border-black h-full"></div>
          
          {/* Teacher Dashboard Connection */}
          <div className="absolute top-0 left-1/2 transform -translate-x-5 border-l-2 border-dashed border-black h-1/3"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-5 border-t-2 border-dashed border-black w-20"></div>
          <div className="absolute top-1/3 left-1/2 transform translate-x-10 border-l-2 border-dashed border-black h-2/3"></div>
          
          {/* Admin Dashboard Connection */}
          <div className="absolute top-0 right-1/4 transform translate-x-1/2 border-l-2 border-dashed border-black h-1/4"></div>
          <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 border-t-2 border-dashed border-black w-40"></div>
          <div className="absolute top-1/4 right-1/4 transform -translate-x-32 border-l-2 border-dashed border-black h-3/4"></div>
        </div>
        
        {/* Dashboard Details */}
        <div className="flex justify-between w-full mb-10">
          {/* Student Dashboard Box */}
          <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">STUDENT DASHBOARD</h2>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="bg-green-500 rounded-full p-1 mr-2"></div>
                <span>Student Profile (From 'students' DB)</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-500 rounded-full p-1 mr-2"></div>
                <span>Attendance Overview (From 'attendance')</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-500 rounded-full p-1 mr-2"></div>
                <span>Last 7 Days Records (From 'records' DB)</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-500 rounded-full p-1 mr-2"></div>
                <span>Timetable (From 'timetable' DB)</span>
              </li>
              <li className="flex items-center">
                <div className="bg-green-500 rounded-full p-1 mr-2"></div>
                <span>Results (Future Scope)</span>
              </li>
            </ul>
          </div>
          
          {/* Teacher Dashboard Box */}
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg w-1/3 mx-4">
            <h2 className="text-xl font-bold mb-4 text-center">TEACHER DASHBOARD</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-red-400 rounded-full p-1 mr-2 mt-1"></div>
                <span>Teacher Profile (From 'teachers' DB)</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-400 rounded-full p-1 mr-2 mt-1"></div>
                <div>
                  <span>Mark Attendance</span>
                  <ul className="ml-6 mt-1 space-y-1 text-sm">
                    <li>Select: Dept, Section, Period, Year</li>
                    <li>Mark: <Check size={12} className="inline" /> / <X size={12} className="inline" /> / <Circle size={12} className="inline" /> for each student</li>
                    <li>Submit / Save Edit / Clear</li>
                    <li>Save to: 'records' and 'attendance_stats'</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-red-400 rounded-full p-1 mr-2 mt-1"></div>
                <span>View Timetable (From 'teacher_timetable')</span>
              </li>
              <li className="flex items-start">
                <div className="bg-red-400 rounded-full p-1 mr-2 mt-1"></div>
                <span>Request Substitute Class (To Admin)</span>
              </li>
            </ul>
          </div>
          
          {/* Admin Panel Box */}
          <div className="bg-purple-700 text-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4 text-center">ADMIN PANEL ACTIONS</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-purple-500 rounded-full p-1 mr-2 mt-1"></div>
                <div>
                  <span>Receive Notifications:</span>
                  <ul className="ml-6 mt-1 space-y-1">
                    <li className="flex items-center">
                      <div className="bg-purple-500 rounded-full p-0.5 mr-1"></div>
                      <span>Late Attendance</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-purple-500 rounded-full p-0.5 mr-1"></div>
                      <span>Sub Requests</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-purple-500 rounded-full p-0.5 mr-1"></div>
                      <span>Unmarked Classes</span>
                    </li>
                    <li className="flex items-center">
                      <div className="bg-purple-500 rounded-full p-0.5 mr-1"></div>
                      <span>Password Reset Requests</span>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="flex items-center">
                <div className="bg-purple-500 rounded-full p-1 mr-2"></div>
                <span>Assign Substitute Teachers</span>
              </li>
              <li className="flex items-center">
                <div className="bg-purple-500 rounded-full p-1 mr-2"></div>
                <span>View Attendance Logs</span>
              </li>
              <li className="flex items-center">
                <div className="bg-purple-500 rounded-full p-1 mr-2"></div>
                <span>Reset Passwords (After Approval)</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Dashed Connectors */}
        <div className="absolute w-full" style={{ top: '60%', left: '0', zIndex: '1' }}>
          {/* Student Dashboard connector */}
          <div className="border-r-2 border-dashed border-black absolute" style={{ height: '290px', left: '23%', top: '-200px' }}></div>
          <div className="border-t-2 border-dashed border-black absolute" style={{ width: '200px', left: '23%', top: '90px' }}></div>
          
          {/* Teacher Dashboard connector */}
          <div className="border-r-2 border-dashed border-black absolute" style={{ height: '100px', left: '56%', top: '-15px' }}></div>
          
          {/* Admin Dashboard connector */}
          <div className="border-r-2 border-dashed border-black absolute" style={{ height: '170px', left: '82%', top: '-80px' }}></div>
          <div className="border-t-2 border-dashed border-black absolute" style={{ width: '120px', left: '70%', top: '-80px' }}></div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-gray-600 mt-6">
          <p>College Attendance Management System - Academic Project</p>
        </div>
      </div>
    </div>
  );
} 