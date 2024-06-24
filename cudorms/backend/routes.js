import express from "express";
import { Dorm } from "./models/dormModel.js";
const router = express.Router();

//Route for getting all dorms
router.get("/", async (request, response) => {
  try {
    const dorms = await Dorm.find({});
    return response.status(200).json({
      count: dorms.length,
      data: dorms
    });
  }
  catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;


//Route for adding a new dorm
router.post("/", async (request, response) => {
  try {
    if (
      !request.body.name || !request.body.address
    ) {
      return response.status(400).send({
        message: "Send all required fields: dorm name",
      });
    }
    const newDorm = {
      name: request.body.name,
      address: request.body.address,
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
  }
  catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

//Route for updating a specific dorm
router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const { name, address } = request.body;
    if (!name && !address) {
      return response.status(400).json({ message: "Name or address are required" });
    }
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (address) updatedFields.address = address;

    const updatedDorm = await Dorm.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedDorm) {
      return response.status(404).json({ message: "Dorm not found" });
    }
    return response.status(200).json(updatedDorm);
  }
  catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});
