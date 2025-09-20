import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { mongoDBURL, PORT } from "./server/config.js";
import mongoose from "mongoose";
import cors from "cors";
import dormRouter from "./routes.js";
import authRouter from "./routes/authRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/", (request, response) => {
  console.log(request);
  return response.status(234).send("Welcome To CUDorms");
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/dorms", dormRouter);
app.use("/api/blogs", blogRouter);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log("Server Started on port 4000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
