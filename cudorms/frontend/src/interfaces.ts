export interface DormAmenities {
  laundry: boolean;
  kitchen: boolean;
  ac: boolean;
  wifi: boolean;
  parking: boolean;
  gym: boolean;
  studyRoom: boolean;
  elevator: boolean;
  petFriendly: boolean;
  other: string[];
}

export interface RoomType {
  type: 'single' | 'double' | 'triple' | 'quad' | 'suite' | 'apartment';
  price: number;
  availability: number;
}

export interface DormReview {
  _id: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Dorm {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  address?: {
    street?: string;
    coordinates?: number[];
  };
  images: string[];
  amenities: DormAmenities;
  capacity?: number;
  roomTypes: RoomType[];
  rating: {
    average: number;
    count: number;
  };
  reviews: DormReview[];
  availability: string[];
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  policies?: {
    quietHours?: string;
    guestPolicy?: string;
    petPolicy?: string;
    other?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin';
  year?: 'freshman' | 'sophomore' | 'junior' | 'senior' | 'graduate';
  avatar?: string;
  isVerified: boolean;
}

export interface BlogComment {
  _id: string;
  author: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorName: string;
  dorm?: string;
  tags: string[];
  featuredImage?: string;
  isPublished: boolean;
  views: number;
  likes: string[];
  comments: BlogComment[];
  category: 'general' | 'dorm-specific' | 'review' | 'tips' | 'news';
  createdAt: string;
  updatedAt: string;
}