// Define your TypeScript types and interfaces here

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'chef' | 'customer';
}

export interface Plat {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categories: string[];
  estimatedCookTime: number;
  available: boolean;
  chefId: string;
}

// Add more types as needed
