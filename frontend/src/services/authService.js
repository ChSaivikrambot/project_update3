import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const signup = async (data) => {
  const response = await axios.post(`${API_URL}/signup`, data);
  return response.data;
};

const login = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token"); // 🔥 Fix: Now logout is defined
};

export default { signup, login, logout };
