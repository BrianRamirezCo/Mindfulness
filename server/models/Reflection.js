const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    text: String,
  },
  { timestamps: true },
);

const ReflectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    published: {
      type: Boolean,
      default: false,
    },
    comments: [CommentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Reflection", ReflectionSchema);
