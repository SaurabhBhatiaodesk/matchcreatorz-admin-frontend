import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { toast } from "react-toastify";

import { IHeaders } from "../../types";
import { useAuthStore } from "../../store/auth/authStore";
import { Config, ERROR_MSG } from "../../config/AppConfig";

let authStore = useAuthStore.getState();

const getHeaders = (): IHeaders => {
  const headers = {
    accept: "application/json",
    "accept-language": "en",
    "x-market-place-platform": "web",
    "x-market-place-version": "1.0.0",
    "Content-Type": "application/json",
    // Authorization: "",
    // offset: -new Date().getTimezoneOffset(),
  };
  return headers;
};

const handleError = (error: any) => {
  try {
    const { message } = error;
    const msg =
      (error &&
        error.response !== undefined &&
        error?.response?.data?.message) ||
      message ||
      ERROR_MSG.SERVER_ERROR;
    toast.error(`${msg}`);
    if (
      error &&
      error.response !== undefined &&
      error.response.status === 401
    ) {
      // logout
      authStore.logout();
      toast.error('UnAuthorized Access');
    }
  } catch (e) {
    toast.error(`${ERROR_MSG.SERVER_ERROR} ${e}`);
  }
  return false;
};

const api = axios.create({
  baseURL: Config.apiUrl(),
  headers: getHeaders(),
});
api.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    let store: any = sessionStorage.getItem("auth-store");
    let authData = JSON.parse(store);
    let authToken = authData?.state?.token;
    if (authToken) {
      request.headers.Authorization = `Bearer ${authToken}`;
    }
    return request;
  },
  (error: AxiosError) => {
    Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    handleError(error);
    return Promise.reject(error);
  }
);

export default api;
