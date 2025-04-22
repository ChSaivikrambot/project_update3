// src/components/OTPVerification.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const phone = localStorage.getItem("resetPhone");

  const handleVerifyOTP = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        phone,
        otp,
      });
      alert("OTP Verified!");
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />
        <button
          onClick={handleVerifyOTP}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
        >
          Verify
        </button>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default OTPVerification;
