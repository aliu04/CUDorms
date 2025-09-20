import express from "express";
import { body, validationResult, query } from "express-validator";
import { Dorm } from "./models/dormModel.js";
import { authenticateToken, requireAdmin } from "./middleware/auth.js";

const router = express.Router();

// Route for getting all dorms with filtering and pagination
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
    query("year")
      .optional()
      .isIn(["freshman", "sophomore", "junior", "senior", "graduate"])
      .withMessage("Invalid year"),
    query("search")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Search term too long"),
    query("minRating")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
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
      const filter = {};

      if (req.query.year) {
        filter.availability = req.query.year;
      }

      if (req.query.minRating) {
        filter["rating.average"] = { $gte: parseFloat(req.query.minRating) };
      }

      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
          { location: { $regex: req.query.search, $options: "i" } },
        ];
      }

      // Get dorms with pagination
      const dorms = await Dorm.find(filter)
        .sort({ "rating.average": -1, name: 1 })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const total = await Dorm.countDocuments(filter);

      res.json({
        dorms,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Dorms fetch error:", error);
      res.status(500).json({ message: "Server error" });
    }
<<<<<<< HEAD
  }
);
=======
    const newDorm = {
      name: request.body.name,
      description: request.body.summary,
      location: request.body.location || null,
      address: request.body.address || null,
      images: request.body.images || null,
      rating: request.body.rating || null,
      availability: request.body.availability || null,
    };
>>>>>>> 4cb2f91b72b4f923eacc21721a6edfc67f3d9767

// Route for getting a specific dorm
router.get("/:id", async (req, res) => {
  try {
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ message: "Dorm not found" });
    }
    res.json(dorm);
  } catch (error) {
    console.error("Dorm fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for adding a new dorm (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Name is required and must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage("Description must be less than 1000 characters"),
    body("location")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Location must be less than 100 characters"),
    body("capacity")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Capacity must be a positive integer"),
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

<<<<<<< HEAD
      const dormData = {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        address: req.body.address,
        images: req.body.images || [],
        amenities: req.body.amenities || {},
        capacity: req.body.capacity,
        roomTypes: req.body.roomTypes || [],
        availability: req.body.availability || [],
        contact: req.body.contact || {},
        policies: req.body.policies || {},
      };

      const dorm = await Dorm.create(dormData);
      res.status(201).json({
        message: "Dorm created successfully",
        dorm,
=======
//Route for updating a specific dorm
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { name, address, description, location, images, rating, availability } =
      request.body;
    if (!name && !description && !address && !location && !images && !rating && !availability) {
      return response.status(400).json({
        message:
          "At least one field (name, description, address, location, images, rating, availability) is required",
>>>>>>> 4cb2f91b72b4f923eacc21721a6edfc67f3d9767
      });
    } catch (error) {
      console.error("Dorm creation error:", error);
      res.status(500).json({ message: "Server error" });
    }
<<<<<<< HEAD
  }
);
=======
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (address) updatedFields.address = address;
    if (location) updatedFields.location = location;
    if (images) updatedFields.images = images;
    if (rating) updatedFields.rating = rating;
    if (availability) updatedFields.availability = availability;
>>>>>>> 4cb2f91b72b4f923eacc21721a6edfc67f3d9767

// Route for updating a specific dorm (admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ message: "Dorm not found" });
    }

    const updatedDorm = await Dorm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Dorm updated successfully",
      dorm: updatedDorm,
    });
  } catch (error) {
    console.error("Dorm update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for deleting a specific dorm (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const dorm = await Dorm.findById(req.params.id);
    if (!dorm) {
      return res.status(404).json({ message: "Dorm not found" });
    }

    await Dorm.findByIdAndDelete(req.params.id);
    res.json({ message: "Dorm deleted successfully" });
  } catch (error) {
    console.error("Dorm deletion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route for adding a review to a dorm
router.post(
  "/:id/reviews",
  authenticateToken,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Comment must be less than 500 characters"),
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

      const dorm = await Dorm.findById(req.params.id);
      if (!dorm) {
        return res.status(404).json({ message: "Dorm not found" });
      }

      // Check if user already reviewed this dorm
      const existingReview = dorm.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );

      if (existingReview) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this dorm" });
      }

      const review = {
        user: req.user._id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        rating: req.body.rating,
        comment: req.body.comment || "",
      };

      dorm.reviews.push(review);

      // Update average rating
      const totalRating = dorm.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      dorm.rating.average = totalRating / dorm.reviews.length;
      dorm.rating.count = dorm.reviews.length;

      await dorm.save();

      res.status(201).json({
        message: "Review added successfully",
        review,
        newAverageRating: dorm.rating.average,
      });
    } catch (error) {
      console.error("Review creation error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
