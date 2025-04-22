import React, { useState } from 'react';
import axios from 'axios';

const ViewClasses = () => {
  const [selectedDay, setSelectedDay] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const teacherId = localStorage.getItem('teacherId');

  const fetchSchedule = async () => {
    if (!selectedDay) {
      alert('Please select a day');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/timetable/teacher', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          teacherId,
          day: selectedDay
        }
      });

      // 👇 Ensure you're setting only the timetable array from the response
      setSchedule(res.data.timetable || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      alert('No classes scheduled');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">📚 My Classes on Selected Day</h2>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <select
          className="border px-4 py-2 rounded shadow-sm"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
        >
          <option value="">-- Select Day --</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={fetchSchedule}
        >
          {loading ? 'Loading...' : 'Fetch Classes'}
        </button>
      </div>

      {schedule.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Period</th>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Section</th>
                <th className="px-4 py-2 text-left">Classroom</th>
                <th className="px-4 py-2 text-left">Effective Dept</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{entry.Period}</td>
                  <td className="px-4 py-2">{entry.Subject}</td>
                  <td className="px-4 py-2">{entry.Section}</td>
                  <td className="px-4 py-2">{entry.Classroom}</td>
                  <td className="px-4 py-2">{entry['Effective Dept']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        selectedDay && <p>No classes scheduled for {selectedDay}.</p>
      )}
    </div>
  );
};

export default ViewClasses;
