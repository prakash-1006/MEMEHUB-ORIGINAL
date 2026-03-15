const mongoose = require("mongoose");

const memeSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },

  caption: {
    type: String
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Meme", memeSchema);
