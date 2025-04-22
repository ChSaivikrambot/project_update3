import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('student');
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const api = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSendOtp = async () => {
    try {
      const payload = {
        phone,
        email,
        ...(role === 'student' ? { studentId } : { teacherId }),
      };

      const res = await axios.post(`${api}/api/auth/send-otp`, payload);
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const payload = {
        phone,
        otp,
        ...(role === 'student' ? { studentId } : { teacherId }),
      };

      const res = await axios.post(`${api}/api/auth/verify-otp`, payload);
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResetPassword = async () => {
    try {
      const payload = {
        phone,
        otp,
        newPassword,
        ...(role === 'student' ? { studentId } : { teacherId }),
      };

      const res = await axios.post(`${api}/api/auth/reset-password`, payload);
      setMessage(res.data.message);
      setStep(1); // Optionally reset or redirect
    } catch (err) {
      setMessage(err.response?.data?.message || 'Password reset failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl border border-gray-100 sm:p-12">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-6 text-center">Forgot Password</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">{message}</p>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Role</label>
        <select
          className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>

      {role === 'student' && (
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Student ID</label>
          <input
            type="text"
            className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter your Student ID"
          />
        </div>
      )}

      {role === 'teacher' && (
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Teacher ID</label>
          <input
            type="text"
            className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            placeholder="Enter your Teacher ID"
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Phone</label>
        <input
          type="text"
          className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter your phone number"
        />
      </div>

      {step === 1 && (
        <>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={handleSendOtp}
            className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 focus:outline-none transition-all duration-200"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">Enter OTP</label>
            <input
              type="text"
              className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
          </div>

          <button
            onClick={handleVerifyOtp}
            className="w-full bg-royalblue-500 text-white py-3 rounded-lg hover:bg-royalblue-600 focus:outline-none transition-all duration-200"
          >
            Verify OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full border border-indigo-300 focus:border-indigo-500 p-3 rounded-lg text-gray-800 focus:outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>

          <button
            onClick={handleResetPassword}
            className="w-full bg-royalblue-500 text-white py-3 rounded-lg hover:bg-royalblue-600 focus:outline-none transition-all duration-200"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
