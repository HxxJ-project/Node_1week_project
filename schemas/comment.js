const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  commentsId: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  commentsTxt: {
    type: String,
    required: true,
  },
  postsId: {
    type: Number,
  },
});

module.exports = mongoose.model("Comments", commentsSchema);
