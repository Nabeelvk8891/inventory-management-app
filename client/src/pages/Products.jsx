import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import { getProducts, deleteProduct } from "../api/productApi";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("newest");

  const [deleteId, setDeleteId] = useState(null);

  /* ---------------- FETCH ---------------- */

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------------- DELETE ---------------- */

  const handleDelete = async () => {
    await deleteProduct(deleteId);
    setDeleteId(null);
    fetchProducts();
  };

  /* ---------------- SEARCH ---------------- */

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setFilter("newest");
  };

  /* ---------------- FILTER + SORT ---------------- */

  const processedProducts = useMemo(() => {
    let list = [...products];

    if (searchTerm) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filter === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (filter === "lowQuantity") {
      list.sort((a, b) => a.quantity - b.quantity);
    }

    return list;
  }, [products, searchTerm, filter]);

  return (
    <Layout>
      <div className="px-4 py-8 md:px-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              Products
            </h1>
            <p className="text-sm text-gray-500">
              Inventory management
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition"
          >
            + Add Product
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">

          {/* SEARCH BAR */}
          <div className="flex flex-1 min-w-[220px] bg-white rounded-full shadow-md overflow-hidden">
            <input
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-5 py-2.5 text-sm outline-none"
            />

            <button
              onClick={handleSearch}
              className="px-4 hover:bg-gray-100 transition flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-slate-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.3-4.3m1.8-5.2a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <FilterDropdown filter={filter} setFilter={setFilter} />

          <button
            onClick={clearFilters}
            className="text-sm px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
          >
            Clear
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-500">
            Loading products...
          </p>
        )}

        {/* EMPTY */}
        {!loading && processedProducts.length === 0 && (
          <p className="text-center text-gray-400 mt-20">
            No products found.
          </p>
        )}

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {processedProducts.map((p) => (
            <motion.div
              key={p._id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-6 
              shadow-[0_4px_20px_rgba(0,0,0,0.06)]
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
              transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between mb-3">
                  <h2 className="font-semibold truncate">
                    {p.name}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      p.quantity <= 5
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {p.quantity <= 5 ? "Low" : "Stock"}
                  </span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {p.description}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-semibold">
                    ₹ {p.price}
                  </span>
                  <span className="text-sm text-gray-400">
                    Qty: {p.quantity}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedId(p._id);
                      setShowEditModal(true);
                    }}
                    className="flex-1 text-sm py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(p._id)}
                    className="flex-1 text-sm py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ADD MODAL */}
        <AnimatePresence>
          {showAddModal && (
            <ModalWrapper onClose={() => setShowAddModal(false)}>
              <AddProduct modal onSuccess={fetchProducts} />
            </ModalWrapper>
          )}
        </AnimatePresence>

        {/* EDIT MODAL */}
        <AnimatePresence>
          {showEditModal && (
            <ModalWrapper onClose={() => setShowEditModal(false)}>
              <EditProduct
                modal
                productId={selectedId}
                onSuccess={fetchProducts}
              />
            </ModalWrapper>
          )}
        </AnimatePresence>

        {/* DELETE MODAL */}
        <AnimatePresence>
          {deleteId && (
            <ConfirmModal
              onCancel={() => setDeleteId(null)}
              onConfirm={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}

/* FILTER DROPDOWN */

function FilterDropdown({ filter, setFilter }) {
  const [open, setOpen] = useState(false);

  const options = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Low Quantity", value: "lowQuantity" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-full shadow bg-white text-sm"
      >
        Filter ▾
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilter(opt.value);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  filter === opt.value && "bg-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* CONFIRM MODAL */

function ConfirmModal({ onCancel, onConfirm }) {
  return (
    <ModalWrapper onClose={onCancel}>
      <div className="bg-white p-6 rounded-2xl text-center shadow-lg">
        <h3 className="text-lg font-semibold mb-3">
          Delete Product?
        </h3>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

/* MODAL WRAPPER */

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
