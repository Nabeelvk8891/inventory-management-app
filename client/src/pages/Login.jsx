import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      navigate("/");

    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid email or password";

      setError(message);
      console.error("Login error:", err); // Dev only
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] 
        rounded-3xl w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-semibold text-slate-900 mb-2 text-center">
          Welcome Back
        </h2>

        <p className="text-slate-500 text-center mb-6 text-sm">
          Sign in to your account
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-xl 
            mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 mb-4 rounded-xl border border-slate-200
          focus:outline-none focus:ring-2 focus:ring-slate-300"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 rounded-xl border border-slate-200
          focus:outline-none focus:ring-2 focus:ring-slate-300"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-medium transition
            ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800"
            }`}
        >
          {loading ? "Signing in..." : "Log In"}
        </button>

        <p className="text-center text-slate-500 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-slate-900 font-medium cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </motion.form>
    </div>
  );
}
