require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Story = require("./models/Story");

const app = express();

// Middleware - order matters!
app.use(cors());
app.use(express.json());   
app.use(express.urlencoded({ extended: true }));

// Routes
const memeRoutes = require("./routes/memeRoutes");
app.use("/api/memes", memeRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const storyRoutes = require("./routes/storyRoutes");
app.use("/api/stories", storyRoutes);

// Cleanup expired stories every hour
setInterval(async () => {
  try {
    const result = await Story.deleteMany({ expiresAt: { $lt: new Date() } });
    if (result.deletedCount > 0) {
      console.log(`Cleaned up ${result.deletedCount} expired stories`);
    }
  } catch (err) {
    console.error('Error cleaning up stories:', err);
  }
}, 60 * 60 * 1000); // Every hour

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error('MongoDB connection failed:', err));

app.get('/',(req,res)=>{
  res.send("server is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
