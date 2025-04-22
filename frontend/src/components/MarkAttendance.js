import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const sectionOptions = {
  CSE: ['PS-21', 'PS-22', 'PS-23', 'PS-24'],
  IT: ['PS-1'],
  AIML: ['PS-21', 'PS-22'],
};

const MarkAttendance = () => {
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [period, setPeriod] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  // Message state
  const [message, setMessage] = useState({ text: '', type: '', visible: false });

  // Handle screen size for responsive design
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Auto-hide message after timeout
  useEffect(() => {
    if (message.visible) {
      const timer = setTimeout(() => {
        setMessage(prev => ({ ...prev, visible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message.visible]);

  const showMessage = (text, type) => {
    setMessage({ text, type, visible: true });
    // Scroll to message if it's not in view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fetchStudents = async () => {
    if (!department || !year || !section || !period) {
      showMessage('Please complete all filter selections before fetching students', 'warning');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/attendance/students', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          department,
          currentYear: Number(year),
          section,
        },
      });

      const studentList = response.data.map(student => ({
        ...student,
        status: 'NotMarked',
      }));

      setStudents(studentList);
      setIsSubmitted(false);
      showMessage(`Successfully loaded ${studentList.length} students`, 'success');
    } catch (error) {
      console.error('Error fetching students:', error);
      showMessage('Failed to fetch students. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, newStatus) => {
    setStudents(prev =>
      prev.map(s =>
        s.studentId === id ? { ...s, status: newStatus } : s
      )
    );
  };

  const markAllStatus = (status) => {
    setStudents(prev => 
      prev.map(s => ({ ...s, status }))
    );
    showMessage(`All students have been marked as ${status}`, 'info');
  };

  const clearAttendance = () => {
    setStudents(prev =>
      prev.map(s => ({ ...s, status: 'NotMarked' }))
    );
    showMessage('All attendance marks have been cleared', 'info');
  };

  const getToday = () => new Date().toISOString().split('T')[0];
  
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const countStatus = (status) =>
    students.filter(s => s.status === status).length;

  const buildRecords = () => {
    const today = getToday();
    return students.map(({ studentId, status }) => ({
      studentId,
      status,
      date: today,
      period,
      section,
      department,
    }));
  };

  const submitAttendance = async () => {
    const notMarkedCount = countStatus('NotMarked');
    
    if (notMarkedCount > 0) {
      showMessage(`${notMarkedCount} students are still not marked. Please mark all students before submitting.`, 'warning');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const attendanceData = {
        records: buildRecords(),
      };

      await axios.post(
        'http://localhost:5000/api/attendance/mark',
        attendanceData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('Attendance submitted successfully!', 'success');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      showMessage('Failed to submit attendance. Please try again later.', 'error');
    }
  };

  const saveAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        records: buildRecords(),
      };

      await axios.put(
        'http://localhost:5000/api/attendance/update',
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Save error:', error);
      showMessage('Failed to save changes. Please check your connection and try again.', 'error');
    }
  };

  // Filter students based on active tab
  const filteredStudents = students.filter(student => {
    if (activeTab === 'all') return true;
    return student.status === activeTab;
  });

  // Get appropriate color classes based on message type
  const getMessageClasses = () => {
    switch (message.type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-300';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-300';
    }
  };
  const handleGoBack = () => {
    // Navigates to TeacherDashboard.js
    navigate('/teacher-dashboard');
  };
  // Get appropriate icon based on message type
  const getMessageIcon = () => {
    switch (message.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (

      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-blue-600 to-blue-700 text-white p-8 shadow-lg rounded-b-lg relative">
        <h1 className="text-4xl font-bold mb-2">Attendance Manager</h1>
        <p className="text-indigo-100 text-lg">{formatDate()}</p>

        {/* Go Back Button positioned at the top-right corner */}
        <button 
          onClick={handleGoBack} 
          className="absolute top-4 right-4 bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold cursor-pointer 
                     transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:scale-105 active:scale-95 
                     shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500"
        >
          Go Back
        </button>
      </div>
      
     
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Message Display */}
        {message.visible && (
          <div className={`mb-6 rounded-lg border p-4 flex items-start ${getMessageClasses()}`}>
            <div className="flex-shrink-0 mr-3">
              {getMessageIcon()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{message.text}</p>
            </div>
            <button 
              onClick={() => setMessage(prev => ({ ...prev, visible: false }))}
              className="ml-auto flex-shrink-0 -mr-1 -mt-1 p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Class Selection Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Class Selection
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setSection('');
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="AIML">AIML</option>
                <option value="IT">IT</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                disabled={!department}
              >
                <option value="">Select Section</option>
                {(sectionOptions[department] || []).map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              >
                <option value="">Select Period</option>
                {[1, 2, 3, 4, 5].map(p => (
                  <option key={p} value={p}>Period {p}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={fetchStudents}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Fetch Students
              </span>
            )}
          </button>
        </div>

        {/* Student List */}
        {students.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-xl font-semibold text-indigo-800 flex items-center mb-3 md:mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Students List ({department} - Year {year} - {section} - Period {period})
              </h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => markAllStatus('Present')} 
                  className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full hover:bg-green-200 transition-colors duration-200"
                >
                  Mark All Present
                </button>
                <button 
                  onClick={() => markAllStatus('Absent')} 
                  className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full hover:bg-red-200 transition-colors duration-200"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Attendance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Present</h3>
                    <p className="text-2xl font-semibold text-indigo-800">{countStatus('Present')}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((countStatus('Present') / students.length) * 100)}% of class
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Absent</h3>
                    <p className="text-2xl font-semibold text-red-800">{countStatus('Absent')}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((countStatus('Absent') / students.length) * 100)}% of class
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">Not Marked</h3>
                    <p className="text-2xl font-semibold text-gray-800">{countStatus('NotMarked')}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((countStatus('NotMarked') / students.length) * 100)}% of class
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                    activeTab === 'all'
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  All Students ({students.length})
                </button>
                <button
                  onClick={() => setActiveTab('Present')}
                  className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                    activeTab === 'Present'
                      ? 'border-b-2 border-green-500 text-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  Present ({countStatus('Present')})
                </button>
                <button
                  onClick={() => setActiveTab('Absent')}
                  className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                    activeTab === 'Absent'
                      ? 'border-b-2 border-red-500 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  Absent ({countStatus('Absent')})
                </button>
                <button
                  onClick={() => setActiveTab('NotMarked')}
                  className={`px-3 py-2 font-medium text-sm rounded-t-lg ${
                    activeTab === 'NotMarked'
                      ? 'border-b-2 border-gray-500 text-gray-600'
                      : 'text-gray-500 hover:text-gray-700'
                  } transition-colors duration-200`}
                >
                  Not Marked ({countStatus('NotMarked')})
                </button>
              </nav>
            </div>

            {/* Student Cards */}
            <div className={`space-y-3 max-h-96 overflow-y-auto p-1 ${filteredStudents.length > 10 ? 'pr-2' : ''}`}>
              {filteredStudents.length === 0 ? (
                <div className="text-center p-6 text-gray-500">
                  No students in this category
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between border p-4 rounded-lg hover:shadow-md transition-shadow duration-200"
                    style={{
                      backgroundColor: 
                        student.status === 'Present' ? 'rgba(236, 253, 245, 0.7)' :
                        student.status === 'Absent' ? 'rgba(254, 242, 242, 0.7)' : 
                        'rgba(249, 250, 251, 0.7)'
                    }}
                  >
                    <div className="mb-3 sm:mb-0">
                      <div className="flex items-center">
                        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold mr-3">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentId}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateStatus(student.studentId, 'Present')}
                        className={`px-4 py-2 rounded-md flex items-center transition-colors duration-200 ${
                          student.status === 'Present'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isMobile ? '' : 'Present'}
                      </button>
                      <button
                        onClick={() => updateStatus(student.studentId, 'Absent')}
                        className={`px-4 py-2 rounded-md flex items-center transition-colors duration-200 ${
                          student.status === 'Absent'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        {isMobile ? '' : 'Absent'}
                      </button>
                      <button
                        onClick={() => updateStatus(student.studentId, 'NotMarked')}
                        className={`px-4 py-2 rounded-md flex items-center transition-colors duration-200 ${
                          student.status === 'NotMarked'
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="00 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18h.01M6 6h.01M13 12h.01" />
        </svg>
        {isMobile ? '' : 'Clear'}
      </button>
    </div>
  </div>
)))}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={clearAttendance}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Marks
              </button>

              {isSubmitted ? (
                <button
                  onClick={saveAttendance}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={submitAttendance}
                  disabled={countStatus('NotMarked') > 0}
                  className={`px-4 py-2 ${
                    countStatus('NotMarked') > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white rounded-md transition-colors duration-200 flex items-center justify-center`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Attendance
                </button>
              )}
            </div>
          </div>
        )}

      
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} College Attendance Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MarkAttendance;