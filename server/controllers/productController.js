import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const images = req.files;

    const imageUrls = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: 'image'
        });
        return result.secure_url;
      })
    );

    const product = await Product.create({ ...productData, image: imageUrls });

    return res.status(201).json({
      success: true,
      message: "Product added",
      product
    });
  } catch (error) {
    console.error("Add Product Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const productList = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    product.inStock = !product.inStock;
    await product.save();

    res.json({
      success: true,
      message: "Stock status updated",
      inStock: product.inStock
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
