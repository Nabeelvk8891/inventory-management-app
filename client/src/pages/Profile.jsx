import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/profile");
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to load profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-gray-500">
            Loading profile...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="px-4 py-8 md:py-14">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-white 
          rounded-3xl p-8 
          shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
        >
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-8">
            <div
              className="w-24 h-24 rounded-full 
              bg-slate-900 text-white 
              flex items-center justify-center 
              text-3xl font-semibold shadow-md"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <h2 className="text-2xl font-semibold mt-4 text-slate-900">
              {user.name}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {user.email}
            </p>
          </div>

          {/* Info */}
          <div className="space-y-6 mb-10">
            <Info label="Full Name" value={user.name} />
            <Info label="Email Address" value={user.email} />
            <Info
              label="Member Since"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="flex-1 py-2.5 rounded-xl 
              bg-slate-900 text-white 
              hover:bg-slate-800 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex-1 py-2.5 rounded-xl 
              bg-red-50 text-red-600 
              hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </motion.div>

        {/* Logout Modal */}
        <AnimatePresence>
          {showLogoutModal && (
            <ModalWrapper onClose={() => setShowLogoutModal(false)}>
              <div className="bg-white p-6 rounded-2xl text-center shadow-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Confirm Logout
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to logout?
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2 rounded-xl bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-red-500 text-white"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </ModalWrapper>
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm 
      flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-sm"
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white 
          w-8 h-8 rounded-full shadow"
        >
          ✕
        </button>

        {children}
      </motion.div>
    </motion.div>
  );
}
