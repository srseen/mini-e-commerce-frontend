import { api } from "../config/axios";
import type { DashboardSummary } from "../types";

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  getSalesReport: async (startDate?: string, endDate?: string) => {
    const response = await api.get("/dashboard/sales-report", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getTopProducts: async (limit?: number) => {
    const response = await api.get("/dashboard/top-products", {
      params: { limit },
    });
    return response.data;
  },

  getSalesByCategory: async () => {
    const response = await api.get("/dashboard/sales-by-category");
    return response.data;
  },

  getUserGrowth: async () => {
    const response = await api.get("/dashboard/user-growth");
    return response.data;
  },

  getInventoryOverview: async () => {
    const response = await api.get("/dashboard/inventory-overview");
    return response.data;
  },
};
