
export interface ListRequest {
  page?: number;
  limit?: number;
  order?: string;
  columnNo?: number;
  search?: string;
  id?: string;
  source?:string
}

export interface ListResponse {
  success: boolean;
  data: {
    records: [];
    totalRecords: number;
    totalPage: number;
    page: number;
  };
  // data: any;

  message: string;
}
