// pals list types
export interface ListRequest {
  page?: number;
  limit?: number;
  order?: string;
  columnNo?: number;
  search?: string;
  id?: string;
}

export interface ListResponse {
  success: boolean;
  data: {
    records: any;
    totalRecords: number;
    totalPage: number;
    page: number;
  };
  // data: any;

  message: string;
}

// pals details type
export interface DetailsRequest {
  id?: string;
}

export interface DetailsResponse {
  success: boolean;
  data: any;
  message: string;
}

// pals details type
export interface EditRequest {
  palId?: string;
}

// pals status update
export interface StatusUpdateRequest {
  id?: string;
  status?: boolean;
}

export interface StatusUpdatesResponse {
  success: boolean;
  data: any;
  message: string;
}

