// Upload utility types
export interface UploadUtiliyRequest {
  location: string;
  extension: string;
}

export interface UploadUtiliyResponse {
  success: boolean;
  data: {
    url: string;
    preview: string;
    filePath: string;
  };
  message: string;
}

// Content management types
export interface PagesListRequest {
  page: number;
  limit: number;
}

export interface PagesListResponse {
  success: boolean;
  data: {
    records: any;
    totalRecords: number;
    totalPage: number;
    page: number;
  };
  message: string;
}

export interface PageEditRequest {
  pageId: string;
  pageType: string;
  description: string;
}

export interface PageEditResponse {
  success: boolean;
  data: any;
  message: string;
}

// Country management types
export interface CountriesListRequest {
  page: number;
  limit: number;
  noLimits?: boolean;
  order: "asc" | "desc";
  columnNo?: number;
  name?: string;
}

export interface CountriesListResponse {
  success: boolean;
  data: any;
  message: string;
}

// Rating & Review management types
export interface RatingListRequest {
  userId: number | null;
  page: number;
  limit: number;
  order: "asc" | "desc";
  columnNo?: number;
  userName?: string;
  search?: string;
}

export interface RatingListResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface RatingListUserRequest {
  page: number;
  limit: number;
  order: "asc" | "desc";
  columnNo?: number;
  userName?: string;
  palId?: string;
}

export interface RatingListUserResponse {
  success: boolean;
  data: {
    info: any;
    totalRecords: number;
    totalPage: number;
    page: number;
  };
  message: string;
}

// Banner management types
export interface BannersListResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface BannersViewResponse {
  success: boolean;
  data: {};
  message: string;
}

export interface BannersAddRequests {
  bannerId?: string;
  url?: string;
  image: string;
}

export interface BannersAddResponse {
  success: boolean;
  data: any;
  message: string;
}
