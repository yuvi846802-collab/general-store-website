export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  profileImage?: string;
  isVerified?: boolean;
  bio?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  language?: string;
  createdAt: Date;
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
