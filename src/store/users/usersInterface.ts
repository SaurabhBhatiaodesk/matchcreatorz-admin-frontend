// list types
export interface ListRequest {
  profileStatus?:string;
  skip?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
  columnNo?: number;
  search?: string;
  id?: string;
  startDate?: string | null;
  endDate?: string | null;
  categoryId?: string;
  tagId?: string;
  responseTime?: string;
  totalRating?: string;
}

export interface ListResponse {
  success: boolean;
  data: any;
  message: string;
}

// details type
export interface DetailsRequest {
  id?: string;
}

export interface DetailsResponse {
  success: boolean;
  data: any;
  message: string;
}

// details type
export interface EditRequest {
  palId?: string;
}

// status update
export interface StatusUpdateRequest {
  id?: string;
  status?: string;
}

export interface StatusUpdatesResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface BookingsListRequests {
  page?: number;
  limit?: number;
  byMonth?: string;
  byYear?: string;
  status?: string;
  subStatus?: string | null;
  pagination?: boolean | null;
  sortBy?: string;
  search?: string;
}

export interface BookingsListResponse {
  success: boolean;
  data: any;
  message: string;
}













