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
      !request.body.name
    ) {
      return response.status(400).send({
        message: "Send all required fields: dorm name",
      });
    }
    const newDorm = {
      name: request.body.name,
    };
    const dorm = await Dorm.create(newDorm);
    return response.status(201).send(dorm);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});