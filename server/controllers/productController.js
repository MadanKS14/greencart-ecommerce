import cloudinary from '../configs/cloudinary.js';
import streamifier from 'streamifier';
import Product from '../models/product.js';

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'products' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const uploadResults = await Promise.all(
      req.files.map(file => uploadToCloudinary(file.buffer))
    );

    const imageUrls = uploadResults.map(r => r.secure_url);

    const product = await Product.create({ ...productData, image: imageUrls });

    return res.status(201).json({
      success: true,
      message: 'Product added',
      product,
    });
  } catch (error) {
    console.error('Add Product Error:', error.message);
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
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    product.inStock = !product.inStock;
    await product.save();
    res.json({
      success: true,
      message: 'Stock status updated',
      inStock: product.inStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
