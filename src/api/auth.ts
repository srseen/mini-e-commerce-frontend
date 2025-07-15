import { api } from "../config/axios";
import type {
  AuthResponse,
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  User,
} from "../types";

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
};
