export interface Dorm {
  _id: string;
  name: string;
  description: string;
  address: { address: string; coordinates: number[] };
  location: string;
  images: string[];
  rating: number;
  availability: string[];
}