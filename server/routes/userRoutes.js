const express = require("express");
const router = express.Router();
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

// Get current user profile
router.get("/profile", protect, async (req, res) => {
  const user = await User
    .findById(req.user)
    .select("-password");

  res.json(user);
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { bio, profilePhoto } = req.body;
    
    const user = await User.findById(req.user);
    
    if (bio !== undefined) user.bio = bio;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search users
router.get("/search/:query", protect, async (req, res) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.query, $options: "i" }
    }).select("-password").limit(20);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (for discovery)
router.get("/all", protect, async (req, res) => {
  try {
    const users = await User.find({ 
      _id: { $ne: req.user } 
    }).select("-password").limit(50);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const user = await User
      .findById(req.params.id)
      .select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Follow a user
router.put("/:id/follow", protect, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.params.id === req.user) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    // Check if already following
    if (currentUser.following.includes(req.params.id)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Add to following
    currentUser.following.push(req.params.id);
    await currentUser.save();

    // Add to followers
    userToFollow.followers.push(req.user);
    await userToFollow.save();

    res.json({ message: "Successfully followed user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unfollow a user
router.put("/:id/unfollow", protect, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
    await currentUser.save();

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user);
    await userToUnfollow.save();

    res.json({ message: "Successfully unfollowed user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
