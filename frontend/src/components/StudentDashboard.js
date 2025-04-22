import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, parseISO } from 'date-fns';
const StudentDashboard = () => {
  const studentId = localStorage.getItem('studentId');
  const [profile, setProfile] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loading, setLoading] = useState({
    profile: false,
    stats: false,
    records: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    if (!studentId) return;
    setLoading((prev) => ({ ...prev, profile: true }));
    try {
      const res = await axios.get(`/api/student/profile/${studentId}`);
      setProfile(res.data);
      setProfileImage(res.data.photo); // base64 or URL
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const fetchAttendanceData = async () => {
    if (!studentId) return;
    setLoading((prev) => ({ ...prev, stats: true, records: true }));
    try {
      const [statsRes, recordsRes] = await Promise.all([
        axios.get(`/api/student/attendance_stats/${studentId}`),
        axios.get(`/api/student/attendrecords/${studentId}`),
      ]);
      setAttendanceStats(statsRes.data);
      setAttendanceRecords(recordsRes.data);
    } catch (err) {
      console.error('Attendance fetch error:', err);
    } finally {
      setLoading((prev) => ({ ...prev, stats: false, records: false }));
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }
      
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setProfileImage(base64); // Instant preview

        try {
          await axios.post('/api/student/upload-photo', {
            studentId,
            photo: base64,
          });
          console.log('✅ Photo uploaded');
        } catch (err) {
          console.error('❌ Upload failed:', err);
          alert('Failed to upload photo. Please try again.');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    navigate('/');
  };

  useEffect(() => {
    if (studentId) {
      fetchProfile();
      fetchAttendanceData();
    } else {
      navigate('/');
    }
  }, [studentId, navigate]);  
  const groupedRecords = attendanceRecords.reduce((acc, record) => {
    // Parse the date from API response
    const recordDate = parseISO(record.date);
    // Format to local date string
    const dateKey = format(recordDate, 'yyyy-MM-dd');
    
    if (!acc[dateKey]) acc[dateKey] = {};
    acc[dateKey][record.period] = record.status;
    return acc;
  }, {});
  
  const getStatusForDate = (date) => {
    // Format the calendar date to match API dates
    const dateKey = format(date, 'yyyy-MM-dd');
    const periods = groupedRecords[dateKey];
    
    if (!periods) return 'calendar-none';
  
    const statuses = Object.values(periods);
    if (statuses.every((s) => s === 'Present')) return 'calendar-present';
    if (statuses.every((s) => s === 'Absent')) return 'calendar-absent';
    return 'calendar-mixed';
  };

  const sortedDates = Object.keys(groupedRecords)
    .sort((a, b) => new Date(b) - new Date(a))
    .slice(0, 7)
    const lastSevenDaysRecords = sortedDates.map((date) => [date, groupedRecords[date]]);

  const formatDate = (dateString) => {
    // Parse the date string using date-fns to handle timezones properly
    const date = parseISO(dateString);
    // Format with local timezone awareness
    return format(date, 'EEE, MMM d');
  };
  

  // Status indicator components
  const StatusIndicator = ({ status }) => {
    const indicators = {
      'Present': {
        bg: 'bg-green-500',
        text: 'text-white',
        icon: '✓',
        label: 'Present'
      },
      'Absent': {
        bg: 'bg-red-500',
        text: 'text-white',
        icon: '✗',
        label: 'Absent'
      },
      'NoSession': {
        bg: 'bg-gray-300',
        text: 'text-gray-700',
        icon: '○',
        label: 'No Session'
      }
    };
    
    const currentStatus = indicators[status] || indicators.NoSession;
    
    return (
      <div className={`flex items-center justify-center rounded-full w-10 h-10 ${currentStatus.bg} ${currentStatus.text}`}>
        <span className="text-lg font-bold">{currentStatus.icon}</span>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 h-8 w-2 rounded-full"></div>
            <h1 className="text-3xl font-bold text-blue-800">Student Dashboard</h1>
          </div>
          <button 
            onClick={handleLogout} 
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>

        {/* Main content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Section */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" 
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading.profile ? (
              <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : profile ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <img
                      src={profileImage || '/default-profile.png'}
                      alt="Profile"
                      className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover shadow-lg"
                    />
                    <label htmlFor="photoUpload" className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-blue-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input type="file" id="photoUpload" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>
                  </div>
                  {isUploading && <p className="text-sm text-blue-600 mt-2">Uploading...</p>}
                  <h2 className="text-2xl font-bold mt-4 text-center">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{studentId}</p>
                </div>
                <div className="space-y-3 text-gray-700 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Department:</span>
                    <span className="text-blue-700">{profile.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Section:</span>
                    <span className="text-blue-700">{profile.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Year of Admission:</span>
                    <span className="text-blue-700">{profile.yearOfAdmission}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No profile found</p>
              </div>
            )}
          </motion.div>

          {/* Attendance Overview */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" 
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 h-8 w-2 rounded-full mr-2"></div>
              <h3 className="text-xl font-bold">Attendance Overview</h3>
            </div>
            {loading.stats ? (
              <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : attendanceStats ? (
              <>
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Attendance</span>
                    <span className="text-sm font-bold text-blue-700">{attendanceStats.attendancePercentage}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        attendanceStats.attendancePercentage >= 75 
                          ? 'bg-green-500' 
                          : attendanceStats.attendancePercentage >= 60 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${attendanceStats.attendancePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>75% Required</span>
                    <span>100%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">Present</span>
                      <span className="text-2xl font-bold text-green-600">{attendanceStats.fullDays}</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600">Total days present</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center justify-between">
                      <span className="text-red-700 font-medium">Absent</span>
                      <span className="text-2xl font-bold text-red-600">{attendanceStats.absentDays}</span>
                    </div>
                    <div className="mt-2 text-xs text-red-600">Total days absent</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center space-x-8">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-gray-600">Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                    <span className="text-sm text-gray-600">No Session</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-64">
                <p className="text-gray-500">No statistics found</p>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300" 
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 h-8 w-2 rounded-full mr-2"></div>
              <h3 className="text-xl font-bold">Quick Actions</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <motion.button
                onClick={() => navigate('/student/timetable')}
                className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-800">View Time Table</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/student/results')}
                className="flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg border border-indigo-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="bg-indigo-500 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="font-medium text-indigo-800">View Results</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
              
              <motion.button
                className="flex items-center justify-between bg-purple-50 hover:bg-purple-100 p-4 rounded-lg border border-purple-200 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center">
                  <div className="bg-purple-500 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="font-medium text-purple-800">Contact Faculty</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Last 7 Days Attendance Records */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-xl mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 h-8 w-2 rounded-full mr-2"></div>
            <h3 className="text-xl font-bold">Recent Attendance</h3>
          </div>
          
          {loading.records ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : lastSevenDaysRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2 bg-gray-50 text-gray-700 font-semibold rounded-tl-lg">Date</th>
                    <th className="text-center px-2 py-2 bg-gray-50 text-gray-700 font-semibold">Period 1</th>
                    <th className="text-center px-2 py-2 bg-gray-50 text-gray-700 font-semibold">Period 2</th>
                    <th className="text-center px-2 py-2 bg-gray-50 text-gray-700 font-semibold">Period 3</th>
                    <th className="text-center px-2 py-2 bg-gray-50 text-gray-700 font-semibold">Period 4</th>
                    <th className="text-center px-2 py-2 bg-gray-50 text-gray-700 font-semibold rounded-tr-lg">Period 5</th>
                  </tr>
                </thead>
                <tbody>
                  {lastSevenDaysRecords.map(([date, periods], index) => (
                    <tr key={date} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 text-gray-800 font-medium">{formatDate(date)}</td>
                      {[1, 2, 3, 4, 5].map((period) => (
                        <td key={period} className="text-center py-2">
                          <div className="flex justify-center">
                            <StatusIndicator status={periods[period] || 'NoSession'} />
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div className="mt-4 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-green-500 mr-2 flex items-center justify-center text-white text-xs font-bold">✓</div>
                  <span className="text-sm text-gray-600">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-red-500 mr-2 flex items-center justify-center text-white text-xs font-bold">✗</div>
                  <span className="text-sm text-gray-600">Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-gray-300 mr-2 flex items-center justify-center text-gray-700 text-xs font-bold">○</div>
                  <span className="text-sm text-gray-600">No Session</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No attendance records available</p>
            </div>
          )}
        </motion.div>

        {/* Attendance Calendar */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-xl mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 h-8 w-2 rounded-full mr-2"></div>
            <h3 className="text-xl font-bold">Attendance Calendar</h3>
          </div>
          <div className="flex justify-center">
            <div className="calendar-container">
              <style jsx="true">{`
                .calendar-container .react-calendar {
                  width: 100%;
                  max-width: 800px;
                  background: white;
                  border: none;
                  font-family: inherit;
                  line-height: 1.5;
                  border-radius: 8px;
                }
                .calendar-container .react-calendar button {
                  border-radius: 8px;
                  margin: 2px;
                }
                .calendar-container .react-calendar__tile--active {
                  background: #3b82f6;
                  color: white;
                }
                .calendar-container .react-calendar__month-view__days__day--weekend {
                  color: #ef4444;
                }
                .calendar-container .calendar-present {
                  background-color: rgba(34, 197, 94, 0.2);
                  position: relative;
                }
                .calendar-container .calendar-present::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 8px;
                  height: 8px;
                  background-color: #22c55e;
                  border-radius: 50%;
                }
                .calendar-container .calendar-absent {
                  background-color: rgba(239, 68, 68, 0.2);
                  position: relative;
                }
                .calendar-container .calendar-absent::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 8px;
                  height: 8px;
                  background-color: #ef4444;
                  border-radius: 50%;
                }
                .calendar-container .calendar-mixed {
                  background-color: rgba(234, 179, 8, 0.2);
                  position: relative;
                }
                .calendar-container .calendar-mixed::after {
                  content: '';
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: 8px;
                  height: 8px;
                  background-color: #eab308;
                  border-radius: 50%;
                }
                .calendar-container .react-calendar__tile:enabled:hover,
                .calendar-container .react-calendar__tile:enabled:focus {
                  background-color: #e0e7ff;
                  border-radius: 8px;
                }
                .calendar-container .react-calendar__navigation button:enabled:hover,
                .calendar-container .react-calendar__navigation button:enabled:focus {
                  background-color: #e0e7ff;
                  border-radius: 8px;
                }
              `}</style>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={({ date }) => getStatusForDate(date)}
              />
              <div className="mt-6 flex justify-center space-x-8">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">All Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm text-gray-600">All Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm text-gray-600">Mixed</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Attendance Details */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-xl mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <div className="bg-blue-600 h-8 w-2 rounded-full mr-2"></div>
            <h3 className="text-xl font-bold">Daily Attendance Details</h3>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-gray-600">Selected Date: <span className="font-medium text-blue-700">
              {selectedDate.toLocaleDateString('en-US', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}
            </span></p>
          </div>
          
          {loading.records ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div>
              {(() => {
                const formatted = format(selectedDate, 'yyyy-MM-dd'); 
                const periods = groupedRecords[formatted];
                
                if (!periods) {
                  return (
                    <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">No attendance records available for this date</p>
                    </div>
                  );
                }
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5].map((period) => {
                      const status = periods[period] || 'NoSession';
                      const statusClasses = {
                        'Present': 'border-green-200 bg-green-50',
                        'Absent': 'border-red-200 bg-red-50',
                        'NoSession': 'border-gray-200 bg-gray-50'
                      };
                      const textClasses = {
                        'Present': 'text-green-800',
                        'Absent': 'text-red-800',
                        'NoSession': 'text-gray-500'
                      };
                      
                      return (
                        <div 
                          key={period} 
                          className={`p-4 rounded-lg border ${statusClasses[status] || statusClasses.NoSession}`}
                        >
                          <div className="text-center">
                            <div className={`text-xl font-bold mb-1 ${textClasses[status] || textClasses.NoSession}`}>
                              Period {period}
                            </div>
                            <div className="flex justify-center mb-3">
                              <StatusIndicator status={status} />
                            </div>
                            <div className={`font-medium ${textClasses[status] || textClasses.NoSession}`}>
                              {status === 'Present' ? 'Present' : status === 'Absent' ? 'Absent' : 'No Session'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>© 2025 Educational Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;