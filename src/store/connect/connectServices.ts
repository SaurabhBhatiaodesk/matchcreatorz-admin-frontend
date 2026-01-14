import { useMutation } from "react-query";
import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";
import {
  DetailsRequest,
  StatusUpdateRequest,
  StatusUpdatesResponse,
  ListRequest,
} from "./connectInterface";

// Connect API

// Fetch connect list
export const useConnectList = () => {
  return useMutation(async (params: ListRequest) => {
    const response = await api.get(
      `${API_URLS.CONNECT_LIST}?pagination=${false}&skip=0&limit=${params?.limit ?? 10}&activeStatus=ALL&sortBy=id&sortDirection=DESC&search=${params?.search}`
    );
    return response?.data;
  });
};

// Fetch connect details
export const useConnectDetails = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response = await api.get(
      API_URLS.CONNECT_DETAILS + "/" + id
    );
    return response?.data;
  });
};

// Delete a connect entry
export const useConnectDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.CONNECT_DELETE + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};

// Update connect status
export const useConnectStatusUpdate = () => {
  return useMutation(async ({ id }: StatusUpdateRequest) => {
    const response: { data: StatusUpdatesResponse } = await api.get(
      API_URLS.CONNECT_STATUS_CHANGE + "/" + id
    );
    return response?.data;
  });
};

// Add or edit connect entry
export const useConnectAddEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.put(
      API_URLS.CONNECT_ADD_UPDATE,
      {
        ...params,
      }
    );

    return response?.data;
  });
};
