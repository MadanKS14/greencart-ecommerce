import cloudinary from "../configs/cloudinary.js";
import streamifier from "streamifier";
import Product from "../models/product.js";

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "products" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData || "{}");

    if (!req.files?.length) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );
    const imageUrls = uploadResults.map((r) => r.secure_url);

    const product = await Product.create({
      ...productData,
      image: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: "Product added",
      product,
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

export const productList = async (_req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { inStock } = req.body;

    const product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    product.inStock =
      typeof inStock === "boolean" ? inStock : !product.inStock;
    await product.save();

    res.json({
      success: true,
      message: "Stock status updated",
      inStock: product.inStock,
      product,
    });
  } catch (err) {
    console.error("Change Stock Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
