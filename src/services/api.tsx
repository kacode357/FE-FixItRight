import { defaultAxiosInstance, axiosWithoutLoading } from "../utils/axios.customize";

const LoginUserApi = async (data: { UserName: string; Password: string }) => {
  const URL_API = "/api/authentications/login";
  const response = await axiosWithoutLoading.post(URL_API, data);
  return response.data;
};

const GetCurrentLogin = async () => {
  const URL_API = "/api/authentications/current-user";
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
  const response = await defaultAxiosInstance.post(URL_API, params);
  return response.data;
};

const DeleteUser = async (userId: string) => {
  const URL_API = `/api/users/${userId}/deactivate`;
  const response = await defaultAxiosInstance.put(URL_API);
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
    Address: string;
    Email: string;
    Avatar?:
      | string
      | "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=6&m=1223671392&s=170667a&w=0&h=zP3l7WJinOFaGb2i1F4g8IS2ylw0FlIaa6x3tP9sebU=";
  }
) => {
  const response = await defaultAxiosInstance.put(`/api/users/${userId}`, data);
  return response.data;
};

const AddAccountCustomerApi = async (data: {
  Fullname: string;
  Gender: string;
  Birthday: string;
  UserName: string;
  Password: string;
  PhoneNumber: string;
}) => {
  const URL_API = "/api/authentication/customers";
  const response = await axiosWithoutLoading.post(URL_API, data);
  return response.data;
};

const AddAccountMechanistsApi = async (data: {
  Fullname: string;
  Gender: string;
  Birthday: string;
  UserName: string;
  Password: string;
  PhoneNumber: string;
}) => {
  const URL_API = "/api/authentication/mechanists";
  const response = await axiosWithoutLoading.post(URL_API, data);
  return response.data;
};

const GetAllRepairServices = async (params: {
  Active?: boolean;
  PageNumber: number;
  PageSize: number;
  SearchName?: string | null;
}) => {
  const URL_API = "/api/repair-services/get-services";
  const response = await defaultAxiosInstance.post(URL_API, params);
  return response.data;
};

const AddRepairServiceApi = async (data: { Name: string; Description: string; Price: number }) => {
  const URL_API = "/api/repair-services";
  const response = await axiosWithoutLoading.post(URL_API, data);
  return response.data;
};

const DeleteRepairServiceApi = async (serviceId: string) => {
  const URL_API = `/api/repair-services/${serviceId}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};

const GetRepairServiceById = async (serviceId: string) => {
  const URL_API = `/api/repair-services/${serviceId}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};

const EditRepairServiceApi = async (
  serviceId: string,
  data: {
    Name: string;
    Description: string;
    Price: number;
  }
) => {
  const URL_API = `/api/repair-services/${serviceId}`;
  const response = await axiosWithoutLoading.put(URL_API, data);
  return response.data;
};

const getTotalUsers = async () => {
  const URL_API = "/api/users/number-of-users";
  const response = await defaultAxiosInstance.get(URL_API);
  return response;
};

export {
  EditRepairServiceApi,
  GetRepairServiceById,
  DeleteRepairServiceApi,
  AddRepairServiceApi,
  GetAllRepairServices,
  AddAccountCustomerApi,
  AddAccountMechanistsApi,
  UpdateUser,
  ViewUser,
  DeleteUser,
  GetAllUsers,
  GetCurrentLogin,
  LoginUserApi,
  getTotalUsers,
};
