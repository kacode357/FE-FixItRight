import { defaultAxiosInstance } from "../utils/axios.customize";

export const transactionService = {
  getTransactions: async (PageNumber: number, PageSize: number) => {
    const response = await defaultAxiosInstance.post(
      `/api/transactions/get-transactions?PageNumber=${PageNumber}&PageSize=${PageSize}`
    );
    return response.data.Data;
  },
};
