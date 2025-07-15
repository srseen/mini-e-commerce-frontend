import { api } from "../config/axios";
import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
  CouponValidationResponse,
} from "../types";

export const couponsApi = {
  validate: async (
    data: ValidateCouponDto
  ): Promise<CouponValidationResponse> => {
    const response = await api.post("/coupons/validate", data);
    return response.data;
  },

  getActive: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons/active");
    return response.data;
  },

  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get("/coupons");
    return response.data;
  },

  getById: async (id: string): Promise<Coupon> => {
    const response = await api.get(`/coupons/${id}`);
    return response.data;
  },

  create: async (data: CreateCouponDto): Promise<Coupon> => {
    const response = await api.post("/coupons", data);
    return response.data;
  },

  update: async (id: string, data: UpdateCouponDto): Promise<Coupon> => {
    const response = await api.put(`/coupons/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/coupons/${id}`);
  },
};
