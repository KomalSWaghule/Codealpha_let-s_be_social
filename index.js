const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const postRoutes = require("./backend/routes/postRoutes");
const authRoutes = require("./backend/routes/authRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const commentRoutes = require("./backend/routes/commentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 


mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://komalwaghule05:Komal11062005@cluster0.pmivpsb.mongodb.net/social_media?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/auth", authRoutes);         
app.use("/posts", postRoutes);        
app.use("/users", userRoutes);        
app.use("/comments", commentRoutes);  

// Serve HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "auth.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
