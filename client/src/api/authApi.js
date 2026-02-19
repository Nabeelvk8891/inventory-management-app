import API from "./axios";

// Register
export const registerUser = (data) =>
  API.post("/auth/register", data);

// Login
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);

  localStorage.setItem("token", res.data.token);

  return res.data;
};

// Get Profile
export const getProfile = () =>
  API.get("/auth/profile");

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
};
