const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  postsId: {
    type: Number,
    required: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
