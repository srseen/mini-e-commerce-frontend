// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN" | "CEO";
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  name?: string;
  password?: string;
  shippingAddress?: ShippingAddress;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  richDescription?: string;
  brand?: string;
  price: number;
  salePrice?: number;
  category: Category;
  stock: number;
  images: string[];
  isFeatured: boolean;
  reviews: string[];
  ratings: number;
  numReviews: number;
  status: "active" | "inactive" | "out-of-stock";
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  slug: string;
  description: string;
  richDescription?: string;
  brand?: string;
  price: number;
  salePrice?: number;
  category: string;
  stock: number;
  images?: string[];
  isFeatured?: boolean;
  status?: "active" | "inactive" | "out-of-stock";
}

export interface UpdateProductDto {
  name?: string;
  slug?: string;
  description?: string;
  richDescription?: string;
  brand?: string;
  price?: number;
  salePrice?: number;
  category?: string;
  stock?: number;
  images?: string[];
  isFeatured?: boolean;
  status?: "active" | "inactive" | "out-of-stock";
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  icon?: string;
  color?: string;
}

// Order Types
export interface OrderItem {
  name: string;
  quantity: number;
  image?: string;
  price: number;
  product: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CouponApplied {
  code: string;
  discountAmount: number;
}

export interface Order {
  _id: string;
  user: User;
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  couponApplied?: CouponApplied;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentResult?: any;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  orderItems: OrderItem[];
  shippingInfo: ShippingInfo;
  couponApplied?: CouponApplied;
  itemsPrice: number;
  shippingPrice?: number;
  taxPrice?: number;
  totalPrice: number;
}

export interface UpdateOrderStatusDto {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

// Coupon Types
export interface Coupon {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
  minPurchase?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponDto {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
  minPurchase?: number;
  isActive?: boolean;
}

export interface UpdateCouponDto {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiryDate: string;
  minPurchase?: number;
  isActive?: boolean;
}

export interface ValidateCouponDto {
  code: string;
  orderTotal: number;
}

export interface CouponValidationResponse {
  isValid: boolean;
  discount: number;
  message?: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

// API Response Types
export interface PaginatedResponse<T> {
  data?: T[];
  products?: T[];
  orders?: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Dashboard Types
export interface DashboardSummary {
  sales: {
    today: { totalSales: number; orderCount: number };
    week: { totalSales: number; orderCount: number };
    month: { totalSales: number; orderCount: number };
    year: { totalSales: number; orderCount: number };
  };
  totals: {
    orders: number;
    products: number;
    users: number;
    revenue: number;
  };
}
