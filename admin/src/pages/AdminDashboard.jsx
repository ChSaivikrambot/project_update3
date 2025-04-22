import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const navigate = useNavigate();

  // Fetch admin data and current restriction status
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminData');
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }

    const token = localStorage.getItem('token'); // Adjust token key if needed

    // Get restriction status from backend
    axios
      .get('http://localhost:5000/api/attendance/restriction-status', { // Change to the correct backend URL if needed
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsRestricted(res.data.isRestricted);
      })
      .catch((err) => {
        console.error('Failed to fetch restriction status', err);
      });
  }, []);

  // Handle toggle restriction (enabling/disabling restriction)
  const toggleRestriction = () => {
    const token = localStorage.getItem('token'); // Adjust token storage if needed
    const endpoint = isRestricted
      ? 'http://localhost:5000/api/attendance/unrestrict' // Backend endpoint to disable restriction
      : 'http://localhost:5000/api/attendance/restrict';  // Backend endpoint to enable restriction

    // Send the post request to either enable or disable the restriction
    axios
      .post(endpoint, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.message); // Log success message
        setIsRestricted(!isRestricted); // Update UI with the new restriction status
      })
      .catch((err) => {
        console.error('Toggle failed', err);
      });
  };

  const goToTimetableUpdate = () => {
    navigate('/timetable-update');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {adminData?.adminId}</h1>
      <p>You're logged in as admin.</p>

      <div style={{ marginTop: '2rem' }}>
        <h2>Dashboard Options</h2>
        <ul>
          <li>📊 View Attendance Statistics</li>
          <li>🧾 Edit Attendance Records</li>
          <li>🔒 Approve Reset Password Requests</li>
          <li>🔁 Assign Substitutes</li>
          <li>🧠 AI Suggestions (Coming soon)</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={goToTimetableUpdate} className="btn btn-primary">
          Update Timetable
        </button>
      </div>

      {/* Toggle attendance restriction */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Attendance Marking Restriction</h3>
        <button
          onClick={toggleRestriction}
          className={`btn ${isRestricted ? 'btn-danger' : 'btn-success'}`}
        >
          {isRestricted ? 'Disable Restriction ❌' : 'Enable Restriction ✅'}
        </button>
        <p>Status: {isRestricted ? '🔒 Restricted' : '🔓 Not Restricted'}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
