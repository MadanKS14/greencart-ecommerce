import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user",
    },

    cartItems: {
      type: Object,
      default: {},
    },
  },
  {
    minimize: false,
    // timestamps: true, // Optional
  }
);

const User =
  mongoose.models.user ||
  mongoose.model("user", userSchema);

export default User;