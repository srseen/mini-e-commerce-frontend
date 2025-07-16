import { api } from "../config/axios";
import type { User, PaginatedResponse } from "../types";

export interface UpdateUserRoleDto {
  role: "USER" | "ADMIN" | "CEO";
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN" | "CEO";
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: "USER" | "ADMIN" | "CEO";
  isActive?: boolean;
}

export const usersApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await api.post("/users", data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  updateRole: async (id: string, data: UpdateUserRoleDto): Promise<User> => {
    const response = await api.put(`/users/${id}/role`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/users/stats/overview");
    return response.data;
  },
};
