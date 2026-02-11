const Item = require("../models/Item");
const fs = require("fs");
const path = require("path");

const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      location,
      date,
      contactEmail,
      contactPhone,
    } = req.body;

    if (!title || !description || !category || !type || !location || !date || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const itemData = {
      title,
      description,
      category,
      type,
      location,
      date,
      contactEmail,
      contactPhone: contactPhone || "",
      user: req.user._id,
    };

    if (req.file) {
      itemData.image = req.file.filename;
    }

    const item = await Item.create(itemData);
    const populatedItem = await Item.findById(item._id).populate(
      "user",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Item posted successfully",
      data: populatedItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error creating item",
      error: error.message,
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const { type, category, status, search, page, limit } = req.query;

    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    else query.status = "active";

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Item.countDocuments(query);
    const items = await Item.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching items",
      error: error.message,
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "user",
      "name email phone"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error fetching item",
      error: error.message,
    });
  }
};

const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching your items",
      error: error.message,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (
      item.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      if (item.image) {
        const oldImagePath = path.join(__dirname, "../uploads", item.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = req.file.filename;
    }

    item = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error updating item",
      error: error.message,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (
      item.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads", item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error deleting item",
      error: error.message,
    });
  }
};

const getAdminAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching all items",
      error: error.message,
    });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  getUserItems,
  updateItem,
  deleteItem,
  getAdminAllItems,
};