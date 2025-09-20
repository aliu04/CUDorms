import express from "express";
import { body, validationResult, query } from "express-validator";
import { Blog } from "../models/blogModel.js";
import { Dorm } from "../models/dormModel.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateBlogPost = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("content")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Content is required"),
  body("excerpt")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Excerpt must be less than 300 characters"),
  body("dorm").optional().isMongoId().withMessage("Invalid dorm ID"),
  body("category")
    .optional()
    .isIn(["general", "dorm-specific", "review", "tips", "news"])
    .withMessage("Invalid category"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

// Get all blog posts with filtering and pagination
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
    query("category")
      .optional()
      .isIn(["general", "dorm-specific", "review", "tips", "news"])
      .withMessage("Invalid category"),
    query("dorm").optional().isMongoId().withMessage("Invalid dorm ID"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search term too long"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = { isPublished: true };

      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.dorm) {
        filter.dorm = req.query.dorm;
      }

      if (req.query.search) {
        filter.$or = [
          { title: { $regex: req.query.search, $options: "i" } },
          { content: { $regex: req.query.search, $options: "i" } },
          { tags: { $in: [new RegExp(req.query.search, "i")] } },
        ];
      }

      // Get blog posts with pagination
      const blogs = await Blog.find(filter)
        .populate("author", "username firstName lastName")
        .populate("dorm", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const total = await Blog.countDocuments(filter);

      res.json({
        blogs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Blog fetch error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "username firstName lastName")
      .populate("dorm", "name")
      .populate("likes", "username")
      .populate("comments.author", "username firstName lastName");

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error("Blog fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new blog post
router.post("/", authenticateToken, validateBlogPost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { title, content, excerpt, dorm, tags, featuredImage, category } =
      req.body;

    // If dorm-specific post, verify dorm exists
    if (dorm) {
      const dormExists = await Dorm.findById(dorm);
      if (!dormExists) {
        return res.status(404).json({ message: "Dorm not found" });
      }
    }

    const blogData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 300) + "...",
      author: req.user._id,
      authorName: `${req.user.firstName} ${req.user.lastName}`,
      dorm: dorm || null,
      tags: tags || [],
      featuredImage: featuredImage || null,
      category: category || "general",
    };

    const blog = await Blog.create(blogData);
    await blog.populate("author", "username firstName lastName");
    await blog.populate("dorm", "name");

    res.status(201).json({
      message: "Blog post created successfully",
      blog,
    });
  } catch (error) {
    console.error("Blog creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update blog post
router.put("/:id", authenticateToken, validateBlogPost, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check ownership or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    const { title, content, excerpt, dorm, tags, featuredImage, category } =
      req.body;

    // If dorm-specific post, verify dorm exists
    if (dorm) {
      const dormExists = await Dorm.findById(dorm);
      if (!dormExists) {
        return res.status(404).json({ message: "Dorm not found" });
      }
    }

    const updateData = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 300) + "...",
      dorm: dorm || null,
      tags: tags || [],
      featuredImage: featuredImage || null,
      category: category || "general",
    };

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("author", "username firstName lastName")
      .populate("dorm", "name");

    res.json({
      message: "Blog post updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Blog update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete blog post
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Check ownership or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Blog deletion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like/Unlike blog post
router.post("/:id/like", authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    const userId = req.user._id.toString();
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      message: isLiked ? "Post unliked" : "Post liked",
      likeCount: blog.likes.length,
      isLiked: !isLiked,
    });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add comment to blog post
router.post(
  "/:id/comments",
  authenticateToken,
  [
    body("content")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Comment must be between 1 and 1000 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const blog = await Blog.findById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      const comment = {
        author: req.user._id,
        authorName: `${req.user.firstName} ${req.user.lastName}`,
        content: req.body.content,
      };

      blog.comments.push(comment);
      await blog.save();

      // Populate the new comment
      await blog.populate("comments.author", "username firstName lastName");

      const newComment = blog.comments[blog.comments.length - 1];

      res.status(201).json({
        message: "Comment added successfully",
        comment: newComment,
      });
    } catch (error) {
      console.error("Comment error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
