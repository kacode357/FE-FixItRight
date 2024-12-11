import {
  defaultAxiosInstance,
  axiosWithoutLoading,
} from "../utils/axios.customize";

// Hàm chuyển đổi đối tượng thành FormData
const convertToFormData = (data: { [key: string]: any }): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Kiểm tra nếu là file
      if (data[key] instanceof File || data[key] instanceof Blob) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key].toString());
      }
    }
  }
  return formData;
};

const LoginUserApi = async (data: { UserName: string; Password: string }) => {
  const URL_API = "/api/authentication/login";
  const formData = convertToFormData(data);
  const response = await axiosWithoutLoading.post(URL_API, formData);
  return response.data;
};

const GetCurrentLogin = async () => {
  const URL_API = "/api/authentication/current-user";
  const token = localStorage.getItem("token");
  if (token) {
    const response = await axiosWithoutLoading.get(URL_API);
    return response.data;
  }
};

const GetAllUsers = async (params: {
  Role?: string | null;
  Active: boolean;
  IsVerified: boolean;
  PageNumber: number;
  PageSize: number;
  SearchName?: string | null;
}) => {
  const URL_API = "/api/users";

  const queryParams = new URLSearchParams({
    Active: params.Active.toString(),
    IsVerified: params.IsVerified.toString(),
    PageNumber: params.PageNumber.toString(),
    PageSize: params.PageSize.toString(),
  });
  if (params.Role) {
    queryParams.append("Role", params.Role);
  }
  if (params.SearchName) {
    queryParams.append("SearchName", params.SearchName);
  }
  const fullUrl = `${URL_API}?${queryParams.toString()}`;
  const response = await defaultAxiosInstance.post(fullUrl);
  console.log(response);
  return response.data;
};
const DeleteUser = async (userId: string) => {
  const URL_API = `/api/users/${userId}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};
const ViewUser = async (userId: string) => {
  const URL_API = `/api/users/${userId}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};

const UpdateUser = async (
  userId: string,
  data: {
    Fullname: string;
    Gender: string;
    Birthday: string;
    UserName: string;
    Address?: string | null;
    PhoneNumber: string;
    CccdFront?: File | null; // File object cho ảnh
    CccdBack?: File | null;  // File object cho ảnh
    Avatar?: File | null;    // File object cho ảnh
  }
) => {
  const formData = new FormData();

  formData.append("Fullname", data.Fullname);
  formData.append("Gender", data.Gender);
  formData.append("Birthday", data.Birthday);
  formData.append("UserName", data.UserName);
  formData.append("PhoneNumber", data.PhoneNumber);

  if (data.Address) {
    formData.append("Address", data.Address);
  }
  if (data.CccdFront) {
    formData.append("CccdFront", data.CccdFront);
  }
  if (data.CccdBack) {
    formData.append("CccdBack", data.CccdBack);
  }
  if (data.Avatar) {
    formData.append("Avatar", data.Avatar);
  }

  const response = await defaultAxiosInstance.put(`/api/users/${userId}`, formData);

  return response.data;
};


const AddAccountCustomerApi = async (data: { Fullname: string; Gender: string; Birthday: string; UserName: string; Password: string; PhoneNumber: string; }) => {
  const URL_API = "/api/authentication/customers";
  const formData = convertToFormData(data);
  try {
    const response = await axiosWithoutLoading.post(URL_API, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};
const AddAccountMechanistsApi = async (data: { Fullname: string; Gender: string; Birthday: string; UserName: string; Password: string; PhoneNumber: string; }) => {
  const URL_API = "/api/authentication/mechanists";
  const formData = convertToFormData(data);
  try {
    const response = await axiosWithoutLoading.post(URL_API, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};

export {
  AddAccountCustomerApi,
  AddAccountMechanistsApi,
  UpdateUser,
  ViewUser,
  DeleteUser,
  GetAllUsers,
  GetCurrentLogin,
  LoginUserApi,
};
