import { useMutation } from "react-query";
import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";
import { AdminSettingsResponse } from "./adminServicesInterface";

// Admin Settings API

// Fetch admin settings
export const useAdminSetting = () => {
  return useMutation(async () => {
    const response: { data: AdminSettingsResponse } = await api.get(
      API_URLS.ADMIN_SETTINGS,
      {}
    );
    return response?.data;
  });
};

// Update admin settings
export const useAdminSettingUpdate = () => {
  return useMutation(async (params: any) => {
    const response = await api.put(
      API_URLS.ADMIN_SETTINGS_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Admin Text API

// List texts (this seems to use CATEGORY_DELETE endpoint, consider renaming if it's not a delete action)
export const useTextsList = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.post(API_URLS.CATEGORY_DELETE, {
      ...params,
    });
    return response?.data;
  });
};

// Add new text
export const useTextAdd = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.post(API_URLS.CATEGORY_DELETE, {
      ...params,
    });
    return response?.data;
  });
};

// Edit existing text
export const useTextEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.post(
      API_URLS.CATEGORY_DELETE + "/" + params?.textId,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Delete text
export const useTextDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.get(
      API_URLS.CATEGORY_DELETE + "/" + params?.textId,
      {}
    );
    return response?.data;
  });
};

// Admin Price Range Settings API

// Fetch admin price range settings
export const useAdminPriceRangeSetting = () => {
  return useMutation(async () => {
    const response: { data: any } = await api.get(
      `${API_URLS.ADMIN__PRICE_RANGE}?pagination=false&skip=0&limit=100`,
      {}
    );
    return response?.data;
  });
};

// Fetch admin response time settings
export const useAdminResponseTimeSetting = () => {
  return useMutation(async () => {
    const response: { data: any } = await api.get(
      `${API_URLS.ADMIN_RESPONSE_TIME}?pagination=false&skip=0&limit=100`,
      {}
    );
    return response?.data;
  });
};

// Update admin price range settings
export const useAdminPriceRangeUpdate = () => {
  return useMutation(async (params: any) => {
    const response = await api.put(
      API_URLS.ADMIN_PRICE_RANGE_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Update admin response time settings
export const useAdminResponseTimeUpdate = () => {
  return useMutation(async (params: any) => {
    const response = await api.put(
      API_URLS.ADMIN_RESPONSE_TIME_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

// Delete price range
export const usePriceRangeDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.ADMIN__PRICE_RANGE_DELETE + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};

// Delete response time
export const useResponseTimeDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.ADMIN_RESPONSE_TIME_DELETE + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};
