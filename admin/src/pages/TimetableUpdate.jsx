import React, { useState, useEffect } from "react";
import axios from "axios";

const TimeTableUpdate = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editData, setEditData] = useState(null); // Store the entry being edited
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [day, setDay] = useState("");

  const departmentOptions = ["CSE", "AIML", "IT"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const departmentSections = {
    "CSE": { sections: ["PS-21", "PS-22", "PS-23", "PS-24"], years: [1, 2, 3, 4] },
    "AIML": { sections: ["PS-21", "PS-22"], years: [1, 2, 3, 4] },
    "IT": { sections: ["PS-1"], years: [1, 2, 3, 4] }
  };

  // Replace with the actual token if necessary
  const adminToken = localStorage.getItem("adminToken");

  const fetchTimetable = async () => {
    if (!adminToken) {
      setError("Authentication token missing.");
      return;
    }

    setLoading(true);
    setTimetable([]); // Reset timetable before fetching
    setError(""); // Clear error message

    try {
      const res = await axios.get(
        `http://localhost:5000/api/teachertable?department=${department}&year=${year}&section=${section}&day=${day}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Pass token in the header
          },
        }
      );

      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setTimetable(res.data); // Set the fetched data to state
      } else {
        setError("No timetable data found.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Error fetching timetable");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditData(entry); // Set the data of the entry to be edited
  };

  const handleSave = async () => {
    if (!editData) {
      setError("No entry selected for editing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/teachertable/${editData._id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        // Update state to reflect the changes after successful update
        setTimetable(
          timetable.map((entry) =>
            entry._id === editData._id ? { ...entry, ...editData } : entry
          )
        );
        setEditData(null); // Clear edit data after saving
      } else {
        setError("Failed to update timetable.");
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Error saving timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (department && year && section && day) {
      fetchTimetable();
    }
  }, [department, year, section, day]);

  return (
    <div className="timetable-container">
      <h2>Update Teacher's Timetable</h2>

      {/* Filters */}
      <div className="filters">
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Select Department</option>
          {departmentOptions.map((dept) => (
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
          {department && departmentSections[department]?.sections.map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          disabled={!department}
        >
          <option value="">Select Year</option>
          {department && departmentSections[department]?.years.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>

        <select value={day} onChange={(e) => setDay(e.target.value)} disabled={!year}>
          <option value="">Select Day</option>
          {daysOfWeek.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <button onClick={fetchTimetable}>Fetch Timetable</button>
      </div>

      {/* Error or Loading States */}
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Timetable Table */}
      {timetable.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Period</th>
              <th>Subject</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetable.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.day}</td>
                <td>{entry.period}</td>
                <td>{entry.subject}</td>
                <td>{entry.teacherName}</td>
                <td>
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Form */}
      {editData && (
        <div className="edit-form">
          <h3>Edit Timetable Entry</h3>
          <input
            type="text"
            value={editData.subject}
            onChange={(e) => setEditData({ ...editData, subject: e.target.value })}
            placeholder="Subject"
          />
          <input
            type="text"
            value={editData.teacherName}
            onChange={(e) => setEditData({ ...editData, teacherName: e.target.value })}
            placeholder="Teacher Name"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditData(null)}>Cancel</button>
        </div>
      )}

      {/* Empty State */}
      {timetable.length === 0 && !loading && !error && (
        <p>No data available for the selected filters.</p>
      )}
    </div>
  );
};

export default TimeTableUpdate;
