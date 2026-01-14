import { useMutation } from "react-query";
import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";
import {
  DetailsRequest,
  DetailsResponse,
  StatusUpdateRequest,
  StatusUpdatesResponse,
  ListRequest,
} from "./categoryInterface";

// Category API

// Fetch category list
export const useCategoryList = () => {
  return useMutation(async (params: ListRequest) => {
    const response = await api.get(
      `${API_URLS.CATEGORY_LIST}?pagination=${false}&skip=0&limit=${params?.limit ?? 10}&activeStatus=ALL&sortBy=id&sortDirection=DESC&search=${params?.search}`
    );
    return response?.data;
  });
};

// Fetch category details
export const useCategoryDetails = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response = await api.get(
      API_URLS.CATEGORY_DETAILS + "/" + id
    );
    return response?.data;
  });
};

// Update category status
export const useCategoryStatusUpdate = () => {
  return useMutation(async ({ id }: StatusUpdateRequest) => {
    const response: { data: StatusUpdatesResponse } = await api.get(
      API_URLS.CATEGORY_STATUS_CHANGE + "/" + id
    );
    return response?.data;
  });
};

// Add or edit category
export const useCategoryAddEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.put(
      API_URLS.CATEGORY_ADD_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Tags API

// Fetch tags list by category
export const useTagsList = () => {
  return useMutation(async (params: ListRequest) => {
    const response = await api.get(
      `${API_URLS.TAGS_LIST}?categoryId=${params?.id}&pagination=${false}&skip=0&limit=${params?.limit ?? 10}&activeStatus=ALL&sortBy=id&sortDirection=DESC&search=${params?.search}`
    );
    return response?.data;
  });
};

// Fetch all tags list
export const useAllTagsList = () => {
  return useMutation(async (params: ListRequest) => {
    const response = await api.get(
      `${API_URLS.TAGS_LIST_FOR_FILTER}?pagination=${false}&skip=0&limit=500&activeStatus=ALL&sortBy=id&sortDirection=DESC&search=${params?.search}`
    );
    return response?.data;
  });
};

// Fetch tag details
export const useTagsDetails = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response: { data: DetailsResponse } = await api.get(
      API_URLS.TAGS_DETAILS + "/" + id
    );
    return response?.data;
  });
};

// Add or edit tag
export const useTagsAddEdit = () => {
  return useMutation(async (params: any) => {
    if (!params.categoryId) {
      delete params.categoryId;
    }

    const response: { data: any } = await api.put(
      API_URLS.TAGS_ADD_EDIT,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Update tag status
export const useTagsStatusUpdate = () => {
  return useMutation(async ({ id }: StatusUpdateRequest) => {
    const response: { data: StatusUpdatesResponse } = await api.get(
      API_URLS.TAGS_STATUS_CHANGE + "/" + id
    );
    return response?.data;
  });
};

// Buyers API

// Fetch buyer details
export const usePalDetails = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response: { data: DetailsResponse } = await api.get(
      API_URLS.BUYERS_DETAILS + "/" + id
    );
    return response?.data;
  });
};

// Update seller status
export const useSellerStatusUpdate = () => {
  return useMutation(async ({ id, status }: StatusUpdateRequest) => {
    const response: { data: StatusUpdatesResponse } = await api.get(
      API_URLS.SELLERS_ACCOUNT_STATUS_CHANGE + "/" + id + "/" + status
    );
    return response?.data;
  });
};
