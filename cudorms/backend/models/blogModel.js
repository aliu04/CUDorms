import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    dorm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dorm",
      default: null, // null for general blog posts
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    featuredImage: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        authorName: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    category: {
      type: String,
      enum: ["general", "dorm-specific", "review", "tips", "news"],
      default: "general",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ dorm: 1, createdAt: -1 });
blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

// Virtual for like count
blogSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
blogSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

export const Blog = mongoose.model("Blog", blogSchema);
