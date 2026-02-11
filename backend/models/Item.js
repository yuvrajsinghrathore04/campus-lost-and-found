const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: [
        "Electronics",
        "Books",
        "Clothing",
        "Accessories",
        "Documents",
        "Keys",
        "Wallet",
        "Bag",
        "Sports",
        "Other",
      ],
    },
    type: {
      type: String,
      required: [true, "Please specify if the item is lost or found"],
      enum: ["lost", "found"],
    },
    location: {
      type: String,
      required: [true, "Please provide the location"],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters"],
    },
    date: {
      type: Date,
      required: [true, "Please provide the date"],
    },
    image: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      required: [true, "Please provide contact email"],
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "resolved", "closed"],
      default: "active",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ type: 1, status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ user: 1 });

module.exports = mongoose.model("Item", itemSchema);