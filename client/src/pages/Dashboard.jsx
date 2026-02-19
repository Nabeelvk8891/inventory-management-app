import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getProducts, deleteProduct } from "../api/productApi";

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(
    (p) => Number(p.quantity) < 10
  );

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, p) =>
      sum + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );

  const stockData = products.map((p) => ({
    name: p.name,
    qty: Number(p.quantity),
  }));

  const valueData = products.map((p) => ({
    name: p.name,
    value: Number(p.price || 0) * Number(p.quantity || 0),
  }));

  const confirmDelete = async () => {
    await deleteProduct(deleteId);
    setDeleteId(null);
    fetchProducts();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 px-4 md:px-10 py-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Inventory Dashboard
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-slate-700 text-white rounded-xl shadow"
            >
              Manage
            </button>

            <button
              onClick={() => setShowAdd(true)}
              className="px-4 py-2 bg-sky-500 text-white rounded-xl shadow"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard title="Products" value={totalProducts} />
          <StatCard title="Low Stock" value={lowStockProducts.length} />
          <StatCard title="Inventory Value" value={`₹${totalValue}`} />
          <StatCard title="Low Stock Items" value={lowStockProducts.length} />
        </div>

        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          <ChartCard title="Stock Quantity">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stockData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="qty" fill="#7dd3fc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Inventory Value by Product">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={valueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* LOW STOCK */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-600 mb-4">
            Low Stock Alert
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-green-600">
              All products sufficiently stocked.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lowStockProducts.map((p) => (
                <motion.div
                  key={p._id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl p-4 shadow"
                >
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-slate-600">
                    {p.description}
                  </p>
                  <p>₹ {p.price}</p>
                  <p className="font-medium text-yellow-700">
                    Qty: {p.quantity}
                  </p>

                  <div className="flex justify-between mt-3 text-sm">
                    <button
                      onClick={() => {
                        setSelectedId(p._id);
                        setShowEdit(true);
                      }}
                    >
                      Update
                    </button>

                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ADD MODAL */}
        <AnimatePresence>
          {showAdd && (
            <ModalWrapper onClose={() => setShowAdd(false)}>
              <AddProduct
                modal
                onSuccess={() => {
                  setShowAdd(false);
                  fetchProducts();
                }}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {showEdit && (
            <ModalWrapper onClose={() => setShowEdit(false)}>
              <EditProduct
                modal
                productId={selectedId}
                onSuccess={() => {
                  setShowEdit(false);
                  fetchProducts();
                }}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>

        {/* DELETE MODAL */}
        <AnimatePresence>
          {deleteId && (
            <ModalWrapper onClose={() => setDeleteId(null)}>
              <div className="bg-white p-6 rounded-2xl text-center shadow-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Delete Product?
                </h3>
                <p className="mb-6 text-slate-500">
                  This action cannot be undone.
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="px-4 py-2 bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 bg-red-400 text-white rounded-xl"
                  >
                    Delete
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

function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow p-4 text-center"
    >
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </motion.div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white/60 backdrop-blur-lg border border-white/40 rounded-2xl shadow p-6">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function ModalWrapper({ children, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative w-full max-w-lg"
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-white w-8 h-8 rounded-full shadow"
        >
          ✕
        </button>

        {children}
      </motion.div>
    </motion.div>
  );
}