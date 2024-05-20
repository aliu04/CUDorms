import mongoose from "mongoose";

const dormSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Dorm = mongoose.model("Dorm", dormSchema);
