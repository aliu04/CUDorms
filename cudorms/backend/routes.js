import express from "express";
import { Dorm } from "./models/dormModel.js";
const router = express.Router();

//Route for getting all dorms
router.get("/", async (request, response) => {
  try {
    const dorms = await Dorm.find({});
    return response.status(200).json({
      count: dorms.length,
      data: dorms,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;

//Route for adding a new dorm
router.post("/", async (request, response) => {
  try {
    if (!request.body.name) {
      return response.status(400).send({
        message: "Send all required fields: dorm name",
      });
    }
    const newDorm = {
      name: request.body.name,
      description: request.body.summary,
      location: request.body.location || null,
      address: request.body.address || null,
      images: request.body.images || null,
      rating: request.body.rating || null,
      availability: request.body.availability || null,
    };

    const dorm = await Dorm.create(newDorm);
    return response.status(201).send(dorm);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for getting a specific dorm
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const dorm = await Dorm.findById(id);
    return response.status(200).json(dorm);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

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
      });
    }
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (description) updatedFields.description = description;
    if (address) updatedFields.address = address;
    if (location) updatedFields.location = location;
    if (images) updatedFields.images = images;
    if (rating) updatedFields.rating = rating;
    if (availability) updatedFields.availability = availability;

    const updatedDorm = await Dorm.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedDorm) {
      return response.status(404).json({ message: "Dorm not found" });
    }

    return response.status(200).json(updatedDorm);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for deleting a specific dorm
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const result = await Dorm.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Dorm not found" });
    }
    return response.status(200).send({ message: "Dorm deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
