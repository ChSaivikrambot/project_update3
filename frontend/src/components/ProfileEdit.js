// ProfileEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProfileEdit = () => {
  const { teacherId } = useParams(); // Get teacherId from URL params
  const navigate = useNavigate();
  
  const [teacher, setTeacher] = useState({
    name: '',
    department: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the teacher data on component mount
    axios.get(`http://localhost:5000/api/teachers/${teacherId}`)
      .then(response => {
        setTeacher(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching teacher data');
        setLoading(false);
      });
  }, [teacherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher({ ...teacher, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.put(`http://localhost:5000/api/teachers/${teacherId}`, teacher)
      .then(response => {
        alert('Profile updated successfully');
        navigate(`/profile/${teacherId}`); // Redirect after successful update
      })
      .catch(err => {
        setError('Error updating profile');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={teacher.name}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Department</label>
          <input
            type="text"
            name="department"
            value={teacher.department}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={teacher.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg">
          Save Changes
        </button>
      </form>
    </div>
  );
};

// Exporting a component
export { ProfileEdit };


