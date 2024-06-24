import mongoose from "mongoose";

const dormSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  },
);

export const Dorm = mongoose.model("Dorm", dormSchema);
