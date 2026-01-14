import { useMutation } from "react-query";
import {
  LoginRequest,
  LoginResponse,
  ResetPassRequest,
  DashboardResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  LogoutResponse,
} from "./authInterface";
import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";

// Authentication API

// User login
export const useLogin = () => {
  return useMutation(async ({ email, password }: LoginRequest) => {
    const response: { data: LoginResponse } = await api.post(API_URLS.LOGIN, {
      email,
      password,
    });
    return response?.data;
  });
};

// User logout
export const useLogout = () => {
  return useMutation(async () => {
    const response: { data: LogoutResponse } = await api.get(
      API_URLS.LOGOUT,
      {}
    );
    return response?.data;
  });
};

// Forgot password
export const useForgotPassword = () => {
  return useMutation(async (email: string) => {
    const response: { data: LoginResponse } = await api.post(
      API_URLS.FORGOT_PASSWORD,
      {
        email,
        otpType: "EMAIL",
        type: "FORGOT_PASSWORD",
      }
    );
    return response?.data;
  });
};

// Verify OTP
export const useVerifyOtp = () => {
  return useMutation(async (email: string) => {
    const response: { data: LoginResponse } = await api.post(
      API_URLS.VERIFY_OTP,
      {
        email,
      }
    );
    return response?.data;
  });
};

// Reset password
export const useResetPassword = () => {
  return useMutation(async ({ newPassword, validateString }: ResetPassRequest) => {
    const response: { data: LoginResponse } = await api.post(
      API_URLS.RESET_PASSWORD,
      {
        newPassword,
        validateString,
      }
    );
    return response?.data;
  });
};

// Change password
export const useChangePassword = () => {
  return useMutation(async (params: ResetPassRequest) => {
    const response = await api.post(API_URLS.CHANGE_PASSWORD, {
      ...params,
    });
    return response?.data;
  });
};

// Admin Profile API

// Update admin profile
export const useUpdateAdminProfile = () => {
  return useMutation(async (params: UpdateProfileRequest) => {
    const response: { data: UpdateProfileResponse } = await api.put(
      API_URLS.UPDATE_PROFILE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Fetch admin profile
export const useAdminProfile = () => {
  return useMutation(async () => {
    const response: { data: UpdateProfileResponse } = await api.get(
      API_URLS.ADMIN_PROFILE,
      {}
    );
    return response?.data;
  });
};

// Dashboard API

// Fetch dashboard data
export const useDashboard = () => {
  return useMutation(async (params: any) => {
    const response: { data: DashboardResponse } = await api.get(
      (params?.startDate && params?.endDate)
        ? `${API_URLS.DASHBOARD}?startDate=${params?.startDate}&endDate=${params?.endDate}`
        : API_URLS.DASHBOARD
    );
    return response?.data;
  });
};

// Fetch statistics
export const useStatistics = () => {
  return useMutation(async () => {
    const response: { data: DashboardResponse } = await api.get(
      API_URLS.STATISTIC
    );
    return response?.data;
  });
};
