import { defaultAxiosInstance } from "../utils/axios.customize";

export const transactionService = {
  getTransactions: async (PageNumber: number, PageSize: number) => {
    const res = await defaultAxiosInstance.post(
      `/api/transactions/get-transactions?PageNumber=${PageNumber}&PageSize=${PageSize}`
    );

    const transactions = res.data?.Data ?? [];
    const total = res.data?.MetaData?.TotalCount ?? 0;

    return {
      data: transactions,
      total,
    };
  },

  getTotalTransactions: async () => {
    const res = await defaultAxiosInstance.get(`/api/transactions/total-transactions`);

    return res;
  },

  getTotalMoney: async () => {
    const res = await defaultAxiosInstance.get(`/api/transactions/total-money`);

    return res;
  },
};
