export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  role: string;
  avatar?: string | null;
  profileImage?: string | null;
  isVerified?: boolean;
  bio?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  address?: string | null;
  timezone?: string | null;
  language?: string | null;
  gender?: string | null;
  dateOfBirth?: string | Date | null;
  createdAt?: Date | string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  image: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  isPopular: boolean;
  createdAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number; // Price at time of order
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user?: User;
}

export interface Wishlist {
  id: string;
  userId: string;
  productIds: string[];
}
