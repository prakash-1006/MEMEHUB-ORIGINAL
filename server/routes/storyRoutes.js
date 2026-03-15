const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const Story = require("../models/Story");
const User = require("../models/User");

// Get all stories (from followed users and own)
router.get("/", protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user);
    const followingIds = [...currentUser.following, req.user];
    
    // Get stories that haven't expired
    const now = new Date();
    const stories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: now }
    })
    .populate("user", "username profilePhoto")
    .sort({ createdAt: -1 });

    // Group stories by user
    const groupedStories = stories.reduce((acc, story) => {
      const userId = story.user._id.toString();
      if (!acc[userId]) {
        acc[userId] = {
          user: story.user,
          stories: []
        };
      }
      acc[userId].stories.push(story);
      return acc;
    }, {});

    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's own stories
router.get("/my-stories", protect, async (req, res) => {
  try {
    const now = new Date();
    const stories = await Story.find({
      user: req.user,
      expiresAt: { $gt: now }
    }).sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single user stories
router.get("/user/:userId", async (req, res) => {
  try {
    const now = new Date();
    const stories = await Story.find({
      user: req.params.userId,
      expiresAt: { $gt: now }
    })
    .populate("user", "username profilePhoto")
    .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload a story (image or video)
router.post(
  "/upload",
  protect,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file received" });
    }

    try {
      // Determine resource type based on mimetype
      const resourceType = req.file.mimetype.startsWith("video") ? "video" : "image";

      const stream = cloudinary.uploader.upload_stream(
        { resource_type: resourceType },
        async (error, result) => {
          if (error) {
            return res.status(500).json(error);
          }

          // Story expires in 24 hours
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);

          const story = await Story.create({
            imageUrl: result.secure_url,
            mediaType: resourceType,
            user: req.user,
            expiresAt
          });

          const populatedStory = await Story.findById(story._id)
            .populate("user", "username profilePhoto");

          res.json(populatedStory);
        }
      );

      stream.end(req.file.buffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// View a story (add to views)
router.put("/:id/view", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Don't add if already viewed
    if (!story.views.includes(req.user)) {
      story.views.push(req.user);
      await story.save();
    }

    res.json({ views: story.views.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a story
router.delete("/:id", protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    if (story.user.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized to delete this story" });
    }

    await Story.findByIdAndDelete(req.params.id);
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

