import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import { FaMoon, FaSun } from "react-icons/fa";
import successAnimation from "../assets/success.json";
import loadingAnimation from "../assets/loading.json";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const roleFromQuery = queryParams.get("role");

  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("student");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    studentId: "",
    teacherId: "",
    phone: "",
    password: "",
    name: "",
    department: "",
  });

  useEffect(() => {
    if (roleFromQuery === "teacher" || roleFromQuery === "student") {
      setRole(roleFromQuery);
    } else {
      navigate("/");
    }
  }, [roleFromQuery, navigate]);

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      studentId: "",
      teacherId: "",
      phone: "",
      password: "",
      name: "",
      department: "",
    });
    setErrors({});
    setErrorMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (role === "student" && !formData.studentId) newErrors.studentId = "Required";
    if (role === "teacher" && !formData.teacherId) newErrors.teacherId = "Required";
    if (!formData.password) newErrors.password = "Required";
    if (isSignup) {
      if (!formData.phone) newErrors.phone = "Required";
      if (role === "student" && !formData.name) newErrors.name = "Required";
      if (role === "student" && !formData.department) newErrors.department = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const url = isSignup
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const payload = {
        role,
        password: formData.password,
        ...(role === "student"
          ? {
              studentId: formData.studentId,
              ...(isSignup && {
                name: formData.name,
                department: formData.department,
              }),
            }
          : {
              teacherId: formData.teacherId,
            }),
        ...(isSignup && { phone: formData.phone }),
      };

      console.log("Payload sent to backend:", payload); // ✅ For debugging

      const res = await axios.post(url, payload);
      const token = res.data.token;

      console.log("Backend response:", res.data); // ✅ Check if studentId or teacherId is there

      localStorage.setItem("token", token);
      if (role === "student") {
        localStorage.setItem("studentId", res.data.studentId);
      } else {
        localStorage.setItem("teacherId", res.data.teacherId);
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate(role === "student" ? "/student-dashboard" : "/teacher-dashboard");
      }, 1800);
    } catch (err) {
      setIsLoading(false);
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      console.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const inputClass = (field) =>
    `input ${errors[field] ? "border-red-500" : ""}`;

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-indigo-100 to-indigo-200 text-black"
      } px-4`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl p-2 rounded-full bg-white/30 dark:bg-black/20"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-6 text-indigo-600 tracking-wide dark:text-indigo-400">
        📘 AttendEase
      </h1>

      {showSuccess ? (
        <div className="text-center">
          <Player autoplay loop src={successAnimation} style={{ height: "180px", width: "180px" }} />
          <p className="text-green-500 text-xl mt-4">Login Successful!</p>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white/90 dark:bg-gray-800 shadow-xl rounded-2xl p-8 border border-indigo-200 dark:border-indigo-400">
          <h2 className="text-2xl font-semibold text-center text-indigo-700 dark:text-indigo-300 mb-6">
            {isSignup ? "Sign Up" : "Login"} as{" "}
            <span className="capitalize">{role}</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {role === "student" ? (
              <>
                <input
                  type="text"
                  name="studentId"
                  placeholder="Student ID"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={inputClass("studentId")}
                  required
                />
                {isSignup && (
                  <>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className={inputClass("name")}
                      required
                    />
                    <input
                      type="text"
                      name="department"
                      placeholder="Department"
                      value={formData.department}
                      onChange={handleChange}
                      className={inputClass("department")}
                      required
                    />
                  </>
                )}
              </>
            ) : (
              <input
                type="text"
                name="teacherId"
                placeholder="Teacher ID"
                value={formData.teacherId}
                onChange={handleChange}
                className={inputClass("teacherId")}
                required
              />
            )}

            {isSignup && (
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass("phone")}
                required
              />
            )}

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={inputClass("password")}
              required
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <Player
                  autoplay
                  loop
                  src={loadingAnimation}
                  style={{ height: "30px", width: "30px" }}
                />
              ) : (
                isSignup ? "Sign Up" : "Login"
              )}
            </button>

            {errorMessage && (
              <p className="text-red-500 text-sm text-center mt-4">{errorMessage}</p>
            )}

            <button
              type="button"
              onClick={toggleMode}
              className="text-indigo-600 dark:text-indigo-300 text-sm underline hover:text-indigo-800 dark:hover:text-indigo-400"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </button>

            {!isSignup && (
              <button
                type="button"
                onClick={() => navigate(`/forgot-password?role=${role}`)}
                className="text-red-500 dark:text-red-400 text-sm underline hover:text-red-600"
              >
                Forgot Password?
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
