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