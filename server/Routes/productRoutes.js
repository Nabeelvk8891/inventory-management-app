import express from "express";
import Product from "../Models/Product.js";
import auth from "../Middleware/authMiddleware.js";

const router = express.Router();

// Create
router.post("/", auth, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Read
router.get("/", auth, async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get single product
router.get("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json("Product not found");
    }

    res.json(product);
  } catch (err) {
    res.status(500).json("Server error");
  }
});


// Update
router.put("/:id", auth, async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(product);
});

// Dlt
router.delete("/:id", auth, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json("Deleted");
});

export default router;
