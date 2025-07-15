import { api } from "../config/axios";
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  PaginatedResponse,
} from "../types";

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<Product[]> => {
    const response = await api.get("/products/featured", { params: { limit } });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
