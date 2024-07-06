import mongoose from "mongoose";

const dormSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    address: {
      address: {
        type: String,
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        validate: {
          validator: function (arr) {
            return arr.length === 2;
          },
          message:
            "Coordinates must be an array of exactly 2 numbers [longitude, latitude]",
        },
      },
    },
    images: {
      type: [{ type: String }],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0,
    },
    availability: [
      {
        type: String,
        enum: ["freshman", "sophomore", "junior", "senior"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Dorm = mongoose.model("Dorm", dormSchema);
