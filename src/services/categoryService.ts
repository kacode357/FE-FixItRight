import { defaultAxiosInstance } from "../utils/axios.customize";

export const categoryService = {
  createCategory: async (name: string) => {
    const response = await defaultAxiosInstance.post("/api/categories", { name });
    return response.data;
  },

  getAllCategories: async () => {
    const response = await defaultAxiosInstance.get("/api/categories");
    return response.data;
  },

  getCategoryId: async (id: string) => {
    const response = await defaultAxiosInstance.get(`/api/categories/${id}`);
    return response.data;
  },

  updateCategory: async (id: string, name: string) => {
    const response = await defaultAxiosInstance.put(`/api/categories/${id}`, { name });
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await defaultAxiosInstance.delete(`/api/categories/${id}`);
    return response.data;
  },
};
