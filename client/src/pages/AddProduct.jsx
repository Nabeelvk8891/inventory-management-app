import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { addProduct } from "../api/productApi";
import { motion, AnimatePresence } from "framer-motion";

export default function AddProduct({ modal = false, onSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.quantity) {
      return setError("Please fill required fields");
    }

    try {
      setLoading(true);

      await addProduct({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
      });

      setSuccess(true);

      setTimeout(() => {
        if (modal) {
          onSuccess?.();
        } else {
          navigate("/products");
        }
      }, 1200);

    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const FormUI = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full ${modal ? "" : "max-w-md mx-auto"} 
      bg-white p-6 md:p-8 rounded-2xl shadow-lg border`}
    >
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">
        Add Product
      </h2>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-100 text-red-600 p-2 rounded-lg mb-4 text-center text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-green-100 text-green-700 p-2 rounded-lg mb-4 text-center text-sm"
          >
            Product added successfully 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={submit} className="space-y-4">
        <input
          placeholder="Product Name"
          className="modern-input"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Description"
          className="modern-input"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="modern-input"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Quantity"
          className="modern-input"
          value={form.quantity}
          onChange={(e) =>
            setForm({ ...form, quantity: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </motion.div>
  );

  if (modal) return FormUI;

  return (
    <Layout>
      <div className="px-4 py-8">{FormUI}</div>
    </Layout>
  );
}
