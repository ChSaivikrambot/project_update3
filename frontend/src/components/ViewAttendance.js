import React, { useState } from 'react';
import axios from 'axios';
import './ViewAttendance.css';

const ViewAttendance = () => {
  const [department, setDepartment] = useState('');
  const [section, setSection] = useState('');
  const [year, setYear] = useState('');
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token'); // Ensure token is stored on login

  const departmentSections = {
    CSE: ['PS-21', 'PS-22', 'PS-23', 'PS-24'],
    AIML: ['PS-21', 'PS-22'],
    IT: ['PS-1'],
  };

  const fetchStats = async () => {
    if (!department || !section || !year) {
      alert('Please select department, section, and year');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/view-stats', {
        headers: { Authorization: `Bearer ${token}` },
        params: { department, section, year },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      alert('Failed to fetch stats');
    }
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!stats.length) return;

    const headers = ['Student ID', 'Name', 'Attendance %', 'Performance Tier'];
    const rows = stats.map((s) => [s.studentId, s.name, s.attendancePercentage, s.performanceTier]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = `Attendance_Stats_${department}_${section}_${year}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="view-attendance">
      <h2>📊 View Attendance Stats</h2>

      <div className="filters">
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Select Department</option>
          {Object.keys(departmentSections).map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          disabled={!department}
        >
          <option value="">Select Section</option>
          {department &&
            departmentSections[department].map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
        </select>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <button onClick={fetchStats} disabled={loading}>
          {loading ? 'Loading...' : 'View Attendance'}
        </button>

        {stats.length > 0 && (
          <button onClick={downloadCSV} className="csv-btn">
            ⬇️ Download CSV
          </button>
        )}
      </div>

      {stats.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Attendance %</th>
              <th>Performance Tier</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, index) => (
              <tr key={index}>
                <td>{s.studentId}</td>
                <td>{s.name}</td>
                <td>{s.attendancePercentage}%</td>
                <td>{s.performanceTier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No data to display.</p>
      )}
    </div>
  );
};

export default ViewAttendance;
