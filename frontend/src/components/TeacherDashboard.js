import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/authService';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/dashboard/teacher', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        setTeacher(response.data.profile);
      } catch (err) {
        console.error('Error fetching teacher profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        if (err.response?.status === 401) {
          authService.logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md max-w-md w-full mb-6">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Define quick action items for better maintainability
  const quickActions = [
    {
      title: "Mark Attendance",
      icon: "📋",
      color: "indigo",
      route: "/teacher/mark-attendance"
    },
    {
      title: "View Student Attendance",
      icon: "👨‍🎓",
      color: "blue",
      route: "/teacher/view-students"
    },
    {
      title: "Study Material",
      icon: "📚",
      color: "purple",
      route: "/teacher/study-material"
    },
    {
      title: "View Classes",
      icon: "🏫",
      color: "blue",
      route: "/teacher/view-classes"
    },
    {
      title: "Request Substitution",
      icon: "🔄",
      color: "indigo",
      route: "/teacher/request-substitution"
    },
    {
      title: "Notify Absence",
      icon: "🚫",
      color: "royal",
      route: "/teacher/notify-absence"
    }
  ];

  // Color mapping for different action types
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-300",
    blue: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300",
    purple: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300",
    royal: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 text-2xl">📘AttendEase</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-indigo-50 px-3 py-1 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium text-indigo-800">Online</span>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with improved design */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="px-6 py-8 md:px-10 md:py-10 flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {teacher.name}</h1>
              <p className="text-indigo-100 text-lg">{teacher.department} Department</p>
              <div className="mt-6 bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-sm inline-block">
                <p className="text-sm md:text-base">Teacher ID: <span className="font-semibold">{teacher.teacherId}</span></p>
              </div>
            </div>
            <div className="hidden lg:block">
              <svg className="w-32 h-32 text-white opacity-20" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
              </svg>
            </div>
          </div>
          <div className="bg-indigo-800 bg-opacity-30 py-3 px-6 md:px-10">
            <p className="text-indigo-100 text-sm">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Information with improved design */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transform transition-all duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                  Profile Information
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-indigo-500 font-medium">Full Name</span>
                  <span className="font-medium text-gray-800">{teacher.name}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-indigo-500 font-medium">Department</span>
                  <span className="font-medium text-gray-800">{teacher.department}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-indigo-500 font-medium">Contact Number</span>
                  <span className="font-medium text-gray-800">{teacher.phone}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-indigo-500 font-medium">Experience</span>
                  <span className="font-medium text-gray-800">{teacher.yearsOfExperience} years</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-indigo-500 font-medium">Subjects</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {teacher.subjects?.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{subject}</span>
                    )) || <span className="font-medium text-gray-800">Not specified</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Notifications Panel with improved design */}
            <div className="bg-white rounded-xl shadow-md mt-8 overflow-hidden border border-indigo-100 transform transition-all duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                    </svg>
                    Recent Notifications
                  </div>
                  <span className="bg-white text-indigo-600 text-xs font-bold px-2 py-1 rounded-full">3 New</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 transform transition-all duration-300 hover:translate-x-1 hover:shadow-md">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-blue-800 font-medium">Staff meeting scheduled for Friday at 3 PM</p>
                      <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">New</span>
                    </div>
                    <p className="text-xs text-blue-500 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100 transform transition-all duration-300 hover:translate-x-1 hover:shadow-md">
                    <p className="text-sm text-green-800 font-medium">Your leave request has been approved</p>
                    <p className="text-xs text-green-500 mt-1">Yesterday</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 transform transition-all duration-300 hover:translate-x-1 hover:shadow-md">
                    <p className="text-sm text-purple-800 font-medium">New study materials uploaded for review</p>
                    <p className="text-xs text-purple-500 mt-1">2 days ago</p>
                  </div>
                </div>
                <button className="mt-6 w-full text-white bg-gradient-to-r from-indigo-500 to-blue-500 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  View All Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Attention Score Options with improved design */}
          <div className="lg:col-span-2">
            {/* Quick Actions with improved design */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transform transition-all duration-300 hover:shadow-lg mb-8">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                  </svg>
                  Quick Actions
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button 
                      key={index}
                      onClick={() => navigate(action.route)}
                      className={`${colorClasses[action.color]} px-4 py-4 rounded-lg font-medium transition-all duration-300 border shadow-sm hover:shadow-md flex items-center transform hover:translate-y-1`}
                    >
                      <span className="text-2xl mr-3">{action.icon}</span>
                      <span>{action.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Student Attention Score Options with improved design */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-indigo-100 transform transition-all duration-300 hover:shadow-lg">
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                  </svg>
                  Student Attention Tracking
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mark Attention Score Option with improved design */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-full text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <h3 className="ml-3 text-lg font-semibold text-gray-800">Mark Attention Score</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Upload classroom video footage to analyze student attention levels using our YOLO-based AI model. The system automatically detects and tracks student focus during lectures.</p>
                    <ul className="text-sm text-gray-600 mb-6 space-y-2">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Real-time attention detection
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Automated analysis reports
                      </li>
                    </ul>
                    <button 
                      onClick={() => navigate('/teacher/mark-attention')}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow transition-all duration-300 flex justify-center items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Upload Video for Analysis
                    </button>
                  </div>

                  {/* View Attention Scores Option with improved design */}
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-full text-white">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                        </svg>
                      </div>
                      <h3 className="ml-3 text-lg font-semibold text-gray-800">View Attention Scores</h3>
                    </div>
                    <p className="text-gray-600 mb-4">Access comprehensive analytics and reports on student attention patterns across different classes, subjects, and time periods.</p>
                    <ul className="text-sm text-gray-600 mb-6 space-y-2">
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Detailed student performance
                      </li>
                      <li className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Trend analysis and insights
                      </li>
                    </ul>
                    <button 
                      onClick={() => navigate('/teacher/view-attention-scores')}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-lg shadow transition-all duration-300 flex justify-center items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      View Reports & Analytics
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with improved design */}
      <footer className="bg-gradient-to-r from-indigo-800 to-blue-800 py-6 mt-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-indigo-100">© 2025 📘AttendEase School Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TeacherDashboard;