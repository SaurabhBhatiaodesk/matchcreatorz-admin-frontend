import { useMutation } from "react-query";
import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";
import { ListRequest } from "./notificationInterface";

// Notification API

// Fetch notification list
export const useNotificationBadgesList = () => {
  return useMutation(async (params: any) => { 
    const response = await api.get(
      `${API_URLS.DASH_GET_NOTIFICATION}?skip=${params?.skip ?? 1}&limit=${params?.limit ?? 10}&userType=ADMIN&source=${params?.source}`
    );
    return response?.data;
  });
};

// Fetch notification list
export const useNotificationList = () => {
  return useMutation(async (params: ListRequest) => {    
    const response = await api.get(
      `${API_URLS.GET_NOTIFICATION}?pagination=${false}&skip=${params?.page ?? 1}&limit=${params?.limit ?? 10}&activeStatus=ALL&sortBy=id&sortDirection=DESC&search=${params?.search}&source=${params?.source}`
    );
    
    return response?.data;
  });
};

// Delete notification
export const useNotificationDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.NOTIFICATION_DELETED + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};

// Send notification
export const useNotificationSend = () => {
  return useMutation(async (params: any) => {
    // Remove userId from params if not provided
    if (!params?.userId) {
      delete params.userId;
    }
    
    const response: { data: any } = await api.put(
      API_URLS.SEND_NOTIFICATION,
      {
        ...params,
      }
    );
    
    return response?.data;
  });
};
