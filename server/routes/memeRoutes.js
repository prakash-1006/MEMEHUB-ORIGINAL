const express = require("express");
const router = express.Router();
const Meme = require("../models/Meme");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

// Get all memes
router.get('/', async (req, res) => {
  try {
    const memes = await Meme.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single meme by ID
router.get("/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id).populate("user", "username");
    if (!meme) {
      return res.status(404).json({ message: "Meme not found" });
    }
    res.json(meme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get memes by user
router.get("/user/:userId", async (req, res) => {
  try {
    const memes = await Meme.find({ user: req.params.userId })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like a meme
router.put("/:id/like", protect, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) {
      return res.status(404).json({ message: "Meme not found" });
    }
    
    const userId = req.user;
    if (meme.likes.includes(userId)) {
      // Unlike
      meme.likes = meme.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      meme.likes.push(userId);
    }
    
    await meme.save();
    res.json({ likes: meme.likes.length, liked: meme.likes.includes(userId) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users for search
router.get("/users/all", async (req, res) => {
  try {
    const users = await User.find().select("username _id");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search memes by caption
router.get("/search/:query", async (req, res) => {
  try {
    const memes = await Meme.find({ 
      caption: { $regex: req.params.query, $options: "i" } 
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(memes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create meme (upload)
router.post("/upload", protect, upload.single("image"), async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file received" });
  }

  try {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) return res.status(500).json(error);

        const meme = await Meme.create({
          imageUrl: result.secure_url,
          caption: req.body.caption,
          user: req.user
        });

        res.json(meme);
      }
    );

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete meme
router.delete("/:id", protect, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    
    if (!meme) {
      return res.status(404).json({ message: "Meme not found" });
    }

    if (meme.user.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to delete this meme" });
    }

    await Meme.findByIdAndDelete(req.params.id);
    res.json({ message: "Meme deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
