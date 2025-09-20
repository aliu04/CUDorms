import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Dorm } from "./models/dormModel.js";

// Helper function to add default rating and reviews to dorm data
function addDefaultRatingAndReviews(dorm) {
  return {
    ...dorm,
    rating: {
      average: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating between 3.5-5.0
      count: 0,
    },
    reviews: [],
  };
}

// Cornell dorm data with comprehensive information
const cornellDorms = [
  {
    name: "Clara Dickson Hall",
    description:
      "One of Cornell's largest residence halls, Clara Dickson offers a vibrant community atmosphere with over 460 students. Features the Multicultural Living Learning Unit and various room configurations.",
    location: "North Campus",
    address: {
      street: "Clara Dickson Hall, Ithaca, NY 14850",
      coordinates: [-76.4705, 42.4534],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "Multicultural Living Learning Unit",
        "Community lounges",
        "Mail room",
      ],
    },
    capacity: 460,
    roomTypes: [
      { type: "single", price: 8500, availability: 50 },
      { type: "double", price: 7500, availability: 200 },
      { type: "triple", price: 7000, availability: 30 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: ["24/7 security", "Key card access"],
    },
  },
  {
    name: "Balch Hall",
    description:
      "An all-female residence hall on North Campus, Balch Hall is divided into units and offers a supportive community environment for female students.",
    location: "North Campus",
    address: {
      street: "Balch Hall, Ithaca, NY 14850",
      coordinates: [-76.472, 42.454],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: false,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: ["All-female community", "Unit-based living", "Study lounges"],
    },
    capacity: 280,
    roomTypes: [
      { type: "single", price: 8200, availability: 40 },
      { type: "double", price: 7200, availability: 100 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Female guests only, overnight with registration",
      petPolicy: "No pets allowed",
      other: ["All-female residence", "Unit-based community"],
    },
  },
  {
    name: "Court-Kay-Bauer Community (CKB)",
    description:
      "A group of freshman residence halls offering modern amenities and a supportive environment for first-year students transitioning to college life.",
    location: "North Campus",
    address: {
      street: "Court-Kay-Bauer Community, Ithaca, NY 14850",
      coordinates: [-76.471, 42.453],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "First-year programming",
        "Modern facilities",
        "Community events",
      ],
    },
    capacity: 320,
    roomTypes: [
      { type: "double", price: 7500, availability: 150 },
      { type: "triple", price: 7000, availability: 20 },
    ],
    availability: ["freshman"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: ["First-year focused", "Academic support programs"],
    },
  },
  {
    name: "Risley Residential College",
    description:
      "A program house focusing on creative and performing arts, Risley offers a unique living experience for students interested in the arts and creative expression.",
    location: "North Campus",
    address: {
      street: "Risley Residential College, Ithaca, NY 14850",
      coordinates: [-76.473, 42.4545],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "Art studios",
        "Performance spaces",
        "Creative workshops",
        "Music practice rooms",
      ],
    },
    capacity: 194,
    roomTypes: [
      { type: "single", price: 8800, availability: 30 },
      { type: "double", price: 7800, availability: 80 },
      { type: "suite", price: 8500, availability: 20 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "risley@cornell.edu",
    },
    policies: {
      quietHours: "12 AM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: [
        "Arts-focused community",
        "Creative programming",
        "Performance opportunities",
      ],
    },
  },
  {
    name: "Mary Donlon Hall",
    description:
      "Known for its sociable ambiance and close-knit community, Mary Donlon features an expansive first floor with seating areas and a library, perfect for socializing and studying.",
    location: "North Campus",
    address: {
      street: "Mary Donlon Hall, Ithaca, NY 14850",
      coordinates: [-76.47, 42.4525],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "Large first floor lounge",
        "Library",
        "Community kitchen",
        "Game room",
      ],
    },
    capacity: 300,
    roomTypes: [
      { type: "double", price: 7600, availability: 120 },
      { type: "triple", price: 7100, availability: 30 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: ["Community-focused", "Social programming", "Study groups"],
    },
  },
  {
    name: "Mews Hall",
    description:
      "Offers a wide range of programming for first-year students with modern facilities and a supportive environment for academic and social growth.",
    location: "North Campus",
    address: {
      street: "Mews Hall, Ithaca, NY 14850",
      coordinates: [-76.4725, 42.4535],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "First-year programming",
        "Modern facilities",
        "Academic support",
        "Community events",
      ],
    },
    capacity: 250,
    roomTypes: [
      { type: "double", price: 7500, availability: 100 },
      { type: "triple", price: 7000, availability: 25 },
    ],
    availability: ["freshman"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: ["First-year focused", "Academic programming", "Peer mentoring"],
    },
  },
  {
    name: "Low Rise #7",
    description:
      "Provides a modern and cozy environment with main lounges, study rooms, and kitchens. Features pod-style living with shared common areas.",
    location: "North Campus",
    address: {
      street: "Low Rise #7, Ithaca, NY 14850",
      coordinates: [-76.4715, 42.4532],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: false,
      petFriendly: false,
      other: [
        "Pod-style living",
        "Shared common areas",
        "Modern design",
        "Community kitchen",
      ],
    },
    capacity: 180,
    roomTypes: [
      { type: "double", price: 7400, availability: 80 },
      { type: "triple", price: 6900, availability: 20 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: [
        "Pod-based community",
        "Shared living spaces",
        "Modern amenities",
      ],
    },
  },
  {
    name: "Ganędagǫ: Hall",
    description:
      "A suite-style residence on North Campus, part of the North Campus Residential Expansion. Offers modern living spaces with suite-style configurations.",
    location: "North Campus",
    address: {
      street: "Ganędagǫ: Hall, Ithaca, NY 14850",
      coordinates: [-76.4708, 42.4542],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "Suite-style living",
        "Modern design",
        "Private bathrooms",
        "Common areas",
      ],
    },
    capacity: 200,
    roomTypes: [
      { type: "suite", price: 9000, availability: 50 },
      { type: "double", price: 8000, availability: 50 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: [
        "Suite-style community",
        "Modern facilities",
        "Private living spaces",
      ],
    },
  },
  {
    name: "Toni Morrison Hall",
    description:
      "Another suite-style residence on North Campus, offering modern living spaces with suite-style configurations and contemporary amenities.",
    location: "North Campus",
    address: {
      street: "Toni Morrison Hall, Ithaca, NY 14850",
      coordinates: [-76.4702, 42.4544],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "Suite-style living",
        "Modern design",
        "Private bathrooms",
        "Study lounges",
      ],
    },
    capacity: 200,
    roomTypes: [
      { type: "suite", price: 9000, availability: 50 },
      { type: "double", price: 8000, availability: 50 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: [
        "Suite-style community",
        "Modern facilities",
        "Contemporary design",
      ],
    },
  },
  {
    name: "Townhouse Apartments",
    description:
      "Apartment-style living on North Campus, providing a more independent living experience for upperclassmen with full kitchens and private bathrooms.",
    location: "North Campus",
    address: {
      street: "Townhouse Apartments, Ithaca, NY 14850",
      coordinates: [-76.472, 42.4528],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: true,
      gym: false,
      studyRoom: true,
      elevator: false,
      petFriendly: false,
      other: [
        "Apartment-style living",
        "Full kitchens",
        "Private bathrooms",
        "Independent living",
      ],
    },
    capacity: 120,
    roomTypes: [{ type: "apartment", price: 9500, availability: 30 }],
    availability: ["sophomore", "junior", "senior", "graduate"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "12 AM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: [
        "Independent living",
        "Upperclassmen priority",
        "Apartment-style community",
      ],
    },
  },
  {
    name: "High Rise #5",
    description:
      "A traditional high-rise residence hall offering corridor-style living with modern amenities and stunning views of the campus and surrounding area.",
    location: "North Campus",
    address: {
      street: "High Rise #5, Ithaca, NY 14850",
      coordinates: [-76.4718, 42.4538],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "High-rise living",
        "Campus views",
        "Community lounges",
        "Study spaces",
      ],
    },
    capacity: 400,
    roomTypes: [
      { type: "single", price: 8300, availability: 60 },
      { type: "double", price: 7300, availability: 170 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: ["High-rise community", "Campus views", "Traditional living"],
    },
  },
  {
    name: "Schuyler House",
    description:
      "A smaller, intimate residence hall offering a close-knit community atmosphere with personalized attention and strong resident support.",
    location: "North Campus",
    address: {
      street: "Schuyler House, Ithaca, NY 14850",
      coordinates: [-76.4735, 42.453],
    },
    images: [],
    amenities: {
      laundry: true,
      kitchen: true,
      ac: true,
      wifi: true,
      parking: false,
      gym: false,
      studyRoom: true,
      elevator: true,
      petFriendly: false,
      other: [
        "Intimate community",
        "Personalized support",
        "Small hall atmosphere",
        "Community events",
      ],
    },
    capacity: 150,
    roomTypes: [
      { type: "single", price: 8400, availability: 30 },
      { type: "double", price: 7400, availability: 60 },
    ],
    availability: ["freshman", "sophomore", "junior", "senior"],
    contact: {
      phone: "(607) 255-5000",
      email: "housing@cornell.edu",
    },
    policies: {
      quietHours: "11 PM - 8 AM",
      guestPolicy: "Overnight guests allowed with registration",
      petPolicy: "No pets allowed",
      other: [
        "Small community",
        "Personalized attention",
        "Close-knit atmosphere",
      ],
    },
  },
];

async function seedDorms() {
  try {
    console.log("🌱 Starting dorm seeding process...");

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Connected to MongoDB");

    // Clear existing dorms (optional - remove this if you want to keep existing data)
    const existingDorms = await Dorm.countDocuments();
    if (existingDorms > 0) {
      console.log(`🗑️  Found ${existingDorms} existing dorms. Clearing...`);
      await Dorm.deleteMany({});
      console.log("✅ Existing dorms cleared");
    }

    // Insert new dorms
    console.log("📝 Inserting Cornell dorms...");
    const dormsWithRatings = cornellDorms.map(addDefaultRatingAndReviews);
    const insertedDorms = await Dorm.insertMany(dormsWithRatings);
    console.log(`✅ Successfully inserted ${insertedDorms.length} dorms`);

    // Display summary
    console.log("\n📊 Seeding Summary:");
    console.log(`- Total dorms added: ${insertedDorms.length}`);
    console.log("- Dorms by location:");
    const locationCount = {};
    insertedDorms.forEach((dorm) => {
      locationCount[dorm.location] = (locationCount[dorm.location] || 0) + 1;
    });
    Object.entries(locationCount).forEach(([location, count]) => {
      console.log(`  - ${location}: ${count} dorms`);
    });

    console.log("\n🎉 Dorm seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding dorms:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
}

// Run the seeder
seedDorms();
