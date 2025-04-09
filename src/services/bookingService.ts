import { defaultAxiosInstance } from "../utils/axios.customize";

export const bookingService = {
  getAllBookings: async (Status: string, PageNumber: number, PageSize: number) => {
    let url = `/api/bookings/get-bookings?PageNumber=${PageNumber}&PageSize=${PageSize}`;
    if (Status) url += `&Status=${Status}`;
    const response = await defaultAxiosInstance.post(url);
    return response.data; // Trả cả Data và MetaData
  },

  getBookingById: async (id: string) => {
    const response = await defaultAxiosInstance.get(`/api/bookings/${id}`);
    return response.data;
  },
};
