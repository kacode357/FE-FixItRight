import { defaultAxiosInstance } from "../utils/axios.customize";

export const bookingService = {
  getAllBookings: async (Status: string, PageNumber: number, PageSize: number) => {
    console.log("Sending request with:", { Status, PageNumber, PageSize });
  
    // Tạo URL động tùy theo việc Status có được truyền vào hay không
    let url = "/api/bookings/get-bookings?PageNumber=" + PageNumber + "&PageSize=" + PageSize;
    
    if (Status) {
      url += `&Status=${Status}`;
    }
  
    // Gửi yêu cầu POST với URL đã được tạo
    const response = await defaultAxiosInstance.post(url);
  
    console.log("API Response:", response.data.Data);
    return response.data.Data;
  },
  

  getBookingById: async (id: string) => {
    const response = await defaultAxiosInstance.get(`/api/bookings/${id}`);
    return response.data.Data;
  },
};
