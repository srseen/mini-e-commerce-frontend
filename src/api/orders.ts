import { api } from "../config/axios";
import type {
  Order,
  CreateOrderDto,
  UpdateOrderStatusDto,
  PaginatedResponse,
} from "../types";

export const ordersApi = {
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await api.post("/orders", data);
    return response.data;
  },

  getMyOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get("/orders/my-orders", { params });
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    user?: string;
  }): Promise<PaginatedResponse<Order>> => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: UpdateOrderStatusDto
  ): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/orders/stats/overview");
    return response.data;
  },
};
