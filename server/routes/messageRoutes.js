const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Message = require("../models/Message");

// Get messages with a specific user
router.get("/:userId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post("/", protect, async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    
    const message = await Message.create({
      sender: req.user,
      recipient: recipientId,
      content
    });
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

