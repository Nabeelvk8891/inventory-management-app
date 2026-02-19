import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("All fields required");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      setError(err.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8"
        >
          <h2 className="text-3xl font-semibold text-slate-800 mb-2 text-center">
            Create Account
          </h2>

          <p className="text-slate-500 text-center mb-6">
            Join and manage your inventory
          </p>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <input
            placeholder="Full Name"
            className="modern-input"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Email address"
            className="modern-input"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="modern-input mb-6"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            disabled={loading}
            className="w-full py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center text-slate-500 mt-6 text-sm">
            Already have account?{" "}
            <Link to="/login" className="text-slate-700 font-medium">
              Login
            </Link>
          </p>
        </motion.form>
      </div>

      {/* SUCCESS POPUP */}
      {success && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-2xl shadow-xl text-center"
          >
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Signup Successful 🎉
            </h3>
            <p className="text-slate-500">
              Redirecting to login...
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
}
