export interface UserInterface {
  avatar: string;
  authTokenIssuedAt: number;
  authorizedOtp: number;
  countryCode: string;
  contactNumber: string;
  created: string;
  email: string;
  admin?: string;
  failedLoginAttempts: number;
  firstName: string;
  fullName: string;
  isDeleted: boolean;
  isSuspended: boolean;
  isVerified: boolean;
  lastName: string;
  preventLoginTill: number;
  resetToken: string;
  updated: string;
  __v: number;
  _id: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  data: any;
  message: string;
}


export interface OTPRequest {
  email: string;
  otp: string;
  otpType: string;
}

export interface ResetPassRequest {
  oldPassword?: string;
  newPassword: string;
  confirmPassword?: string;
  userId?: string;
  validateString?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface DashboardResponse {
  success: boolean;
  data: any;
  message: string;
}
