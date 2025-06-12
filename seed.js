// seed.js
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./backend/models/User");
const Post = require("./backend/models/Post");
const Comment = require("./backend/models/Comment");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/socialapp");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    const users = await User.insertMany([
      { username: "alice", email: "alice@example.com", password: "hashed_password" },
      { username: "bob", email: "bob@example.com", password: "hashed_password" },
      { username: "charlie", email: "charlie@example.com", password: "hashed_password" },
    ]);

    // Create posts
    const posts = await Post.insertMany([
      {
        userId: users[0]._id,
        content: "Hello world! This is Alice.",
        likes: [users[1]._id],
        comments: []
      },
      {
        userId: users[1]._id,
        content: "Hey everyone! Bob here.",
        likes: [users[0]._id, users[2]._id],
        comments: []
      }
    ]);

    // Create comments
    const comments = await Comment.insertMany([
      {
        postId: posts[0]._id,
        userId: users[1]._id,
        text: "Nice post, Alice!"
      },
      {
        postId: posts[1]._id,
        userId: users[0]._id,
        text: "Welcome Bob!"
      }
    ]);

    // Link comments to posts
    posts[0].comments.push(comments[0]._id);
    posts[1].comments.push(comments[1]._id);
    await posts[0].save();
    await posts[1].save();

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seed();
