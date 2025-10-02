import express from "express";
import Product from "../models/products.js";
import fetchuser from "../middleware/fetchUser.js";

const router = express.Router();

const addNewProduct = async (req, res) => {
  //   console.log("req.body: ", req.body);
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      currency,
      stock,
      availability,
    } = req.body;
    const user_id = req.user.id;

    const product = new Product({
      name: typeof name === "string" ? name.toLowerCase() : name,
      description:
        typeof description === "string"
          ? description.toLowerCase()
          : description,
      brand: typeof brand === "string" ? brand.toLowerCase() : brand,
      category:
        typeof category === "string" ? category.toLowerCase() : category,
      price: Number(price), // ensure number
      currency:
        typeof currency === "string" ? currency.toLowerCase() : currency,
      stock: Number(stock),
      availability:
        typeof availability === "string"
          ? availability.toLowerCase()
          : availability,
    });
    const savedProduct = await product.save();
    res.json({
      success: true,
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).send("Internal error occurred while adding product");
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send("Internal error occurred while fetching products");
  }
};

const getProductWithId = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("productId: ", productId);
    const product = await Product.findById(productId);
    // console.log("product: ", product);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).send("Internal error occurred while fetching the product");
  }
};

// GET /api/products?page=1&limit=10&search=Fast+Camera&category=Cleaning+Supplies
const searchProducts = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", category } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    // Search filter (name, description, brand)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
      console.log("category: ", category);
    }

    // Count total docs
    const total = await Product.countDocuments(query);
    console.log("query: ", query);

    // Pagination
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      products,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

const removeAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ success: true, message: "All products removed" });
  } catch (error) {
    res.status(500).send("Internal error occurred while removing products");
  }
};

const deleteProductWithId = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted", product });
  } catch (error) {
    res.status(500).send("Internal error occurred while deleting the product");
  }
};
const updateProductWithId = async (req, res) => {
  try {
    const { productId } = req.params;
  } catch (error) {
    res.status(500).send("Internal error occurred while updating the product");
  }
};

router.post("/addproducts", fetchuser, addNewProduct);
router.get("/getAllProducts", fetchuser, getAllProducts);
router.get("/searchProducts", fetchuser, searchProducts);
router.delete("/removeAllProducts", fetchuser, removeAllProducts);
router.get("/:productId", fetchuser, getProductWithId);
router.delete("/:productId", fetchuser, deleteProductWithId);
router.put("/:productId", fetchuser, updateProductWithId);

export default router;
