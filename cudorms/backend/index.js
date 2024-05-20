import express from "express";
import { mongoDBURL, PORT } from "./server/config.js";
import mongoose from "mongoose";
import cors from 'cors';
import router from "./routes.js";


const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}))

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome To CUDorms');
});

app.use('/dorms', router)

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log("Server Started on port 4000");
    });

  })
  .catch((error) => {
    console.log(error)
  });