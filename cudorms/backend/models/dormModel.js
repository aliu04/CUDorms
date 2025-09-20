import mongoose from "mongoose";

const dormSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    address: {
      street: {
        type: String,
        required: false,
      },
      coordinates: {
        type: [Number],
        required: false,
        validate: {
          validator: function (arr) {
            return !arr || arr.length === 2;
          },
          message:
            "Coordinates must be an array of exactly 2 numbers [longitude, latitude]",
        },
      },
    },
    images: {
      type: [{ type: String }],
    },
    amenities: {
      laundry: {
        type: Boolean,
        default: false,
      },
      kitchen: {
        type: Boolean,
        default: false,
      },
      ac: {
        type: Boolean,
        default: false,
      },
      wifi: {
        type: Boolean,
        default: true,
      },
      parking: {
        type: Boolean,
        default: false,
      },
      gym: {
        type: Boolean,
        default: false,
      },
      studyRoom: {
        type: Boolean,
        default: false,
      },
      elevator: {
        type: Boolean,
        default: false,
      },
      petFriendly: {
        type: Boolean,
        default: false,
      },
      other: [
        {
          type: String,
          trim: true,
        },
      ],
    },
    capacity: {
      type: Number,
      min: 1,
    },
    roomTypes: [
      {
        type: {
          type: String,
          enum: ["single", "double", "triple", "quad", "suite", "apartment"],
        },
        price: {
          type: Number,
          min: 0,
        },
        availability: {
          type: Number,
          default: 0,
        },
      },
    ],
    rating: {
      average: {
        type: Number,
        min: 1,
        max: 5,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        userName: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: {
          type: String,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    availability: [
      {
        type: String,
        enum: ["freshman", "sophomore", "junior", "senior", "graduate"],
      },
    ],
    contact: {
      phone: String,
      email: String,
      website: String,
    },
    policies: {
      quietHours: String,
      guestPolicy: String,
      petPolicy: String,
      other: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const Dorm = mongoose.model("Dorm", dormSchema);
