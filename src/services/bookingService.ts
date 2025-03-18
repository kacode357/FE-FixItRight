import { defaultAxiosInstance } from "../utils/axios.customize";

export const bookingService = {
  getAllBookings: async (Status: string, PageNumber: number, PageSize: number) => {
    console.log("Sending request with:", { Status, PageNumber, PageSize });

    const response = await defaultAxiosInstance.post("/api/bookings/get-bookings", {
      Status, // ✅ Gửi đúng vào body
      PageNumber,
      PageSize,
    });

    console.log("API Response:", response.data.Data);
    return response.data.Data;
  },

  getBookingById: async (id: string) => {
    const response = await defaultAxiosInstance.get(`/api/bookings/${id}`);
    return response.data.Data;
  },
};
