import { useMutation } from "react-query";

import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";
import {
  BannersAddRequests,
  BannersListResponse,
  BannersViewResponse, 
  PageEditRequest,
  PageEditResponse,
  PagesListRequest,
  PagesListResponse,
  RatingListRequest,
  RatingListResponse
} from "./commonInterface";
import { ListRequest, StatusUpdatesResponse } from "../category/categoryInterface";
import { StatusUpdateRequest } from "../users/usersInterface";

// upload media api
export const useUploadUtiliy = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.get(
      `${API_URLS.UPLOAD_FILE_URL}?location=${params?.location}&type=${params?.type}&count=${params?.count ?? 1}`,
     // {...params}
    );
    return response?.data;
  });
};

// content-management api
export const usePagesList = () => {
  return useMutation(async (params: PagesListRequest) => {
    const response: { data: PagesListResponse } = await api.get(
      `${API_URLS.PAGES_LIST}?skip=0&limit=${params?.limit ?? 10}`,
    );
    return response?.data;
  });
};

export const usePageEdit = () => {
  return useMutation(
    async ({ pageId, pageType, description }: PageEditRequest) => {
      const response: { data: PageEditResponse } = await api.put(
        API_URLS.PAGE_EDIT,
        {
          id: pageId,
          title: pageType,
          description: description,
        }
      );

      return response?.data;
    }
  );
};

export const usePagesAdd = () => {
  return useMutation(
    async (params: { title: string; description: string; slug?: string }) => {
      const response: { data: PageEditResponse } = await api.post(
        API_URLS.PAGES_ADD,
        {
          title: params.title,
          description: params.description,
          slug: params.slug,
        }
      );

      return response?.data;
    }
  );
};

// banners api
export const useBannersList = () => {
  return useMutation(async (params: ListRequest) => {
    const response: { data: BannersViewResponse } = await api.get(
      `${API_URLS.BANNERS_LIST}?skip=1&limit=${params?.limit ?? 10}`,
      {}
    );
    return response?.data;
  });
};

export const useBannerView = () => {
  return useMutation(async (params: any) => {
    const response: { data: BannersViewResponse } = await api.get(
      API_URLS.BANNER_VIEW + "/" + params?.bannerId,
      {}
    );
    return response?.data;
  });
};

export const useBannersAdd = () => {
  return useMutation(async (params: any) => {

    const response: { data: any } = await api.put(
      API_URLS.BANNER_ADD,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useBannersEdit = () => {
  return useMutation(async (params: BannersAddRequests) => {
    const response: { data: BannersListResponse } = await api.post(
      API_URLS.BANNER_UPDATE + "/" + params?.bannerId,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useBannerDelete = () => {
  return useMutation(async (params: any) => {

   const response: { data: BannersListResponse } = await api.delete(
      API_URLS.BANNER_DELETE + "/" + params?.bannerId,
      {}
    );
    return response?.data;
  });
};

export const useCategoryList = () => {
  return useMutation(async () => {
    const response: { data: any } = await api.get(
      API_URLS.RES_CATEGORY,
    );
    return response?.data;
  });
};

export const useTagsList = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.get(
      `${API_URLS.RES_TAGS}?categoryId=${params?.id ?? 1}`,
    );
    return response?.data;
  });
};

export const useWithdrawList = () => {
  return useMutation(async (params: ListRequest) => {
  const response = await api.get(
    `${API_URLS.WITHDRAW_LIST}?page=${params.page}&limit=${params?.limit ?? 10}&search=${params?.search}&order=${params?.order}`,
  );
  return response?.data;
});
};

export const useWithdrawStatusUpdate = () => {
 return useMutation(async (params: StatusUpdateRequest) => {
   const response: { data: StatusUpdatesResponse } = await api.put(
     API_URLS.WITHDRAW_STATUS_CHANGE,
     {...params}
   );
   return response?.data;
 });
};


export const useWithdrawDetails = () => {
  return useMutation(async ( params : any) => {
    const response: { data: any } = await api.get(
      API_URLS.WITHDRAW_DETAILS + "/" + params?.id
    );
    return response?.data;
  });
};

export const useTestimonialList = () => {
  return useMutation(async (params: ListRequest) => {
  const response = await api.get(
    `${API_URLS.TESTMONIAL_LIST}?skip=${params?.page ?? 1}&limit=${params?.limit ?? 10}`,
  );
  return response?.data;
});
};

export const useTestimonialDelete = () => {
  return useMutation(async ( params : any) => {
    const response: { data: any } = await api.delete(
      API_URLS.TESTMONIAL_DELETE + "/" + params?.id
    );
    return response?.data;
  });
};

export const useTestimonialAdd = () => {
  return useMutation(async ( params : any) => {
    const response: { data: any } = await api.put(
      API_URLS.TESTMONIAL_ADD,{
          ...params
      }
    );
    return response?.data;
  });
};

// Rate & Review Managements Apis
export const useRatingsReviews = () => {
  return useMutation(async (params: RatingListRequest) => {
    const response: { data: RatingListResponse } = await api.get(
      `${API_URLS.RATINGS_REVIEWS_LIST}?pagination=false&skip=${params.page}&limit=${params.limit}&userId=${params.userId}&searchTerm=${params.userName}`
    );
    return response?.data;
  });
};

export const useReviewDelete = () => {
  return useMutation(async ( params : any) => {
    const response: { data: any } = await api.delete(
      API_URLS.RATINGS_REVIEWS_DELETE + "/" + params?.id
    );
    return response?.data;
  });
};

export const useReviewUpdate = () => {
  return useMutation(async ( params : any) => {
    const response: { data: any } = await api.put(
      API_URLS.RATINGS_REVIEWS_UPDATE,{
          ...params
      }
    );
    return response?.data;
  });
};

// Country management apis
export const useCountriesList = () => {
  return useMutation(async () => {
    const response: { data: any } = await api.get(
      API_URLS.COUNTRIES_LIST,
    );
    return response?.data;
  });
};

// Rate Managements Apis
export const useRatings = () => {
  return useMutation(async (params: any) => {
    const response: { data: RatingListResponse } = await api.get(
      `${API_URLS.REPORT_LIST}?skip=${params.page}&limit=${params.limit}&searchTerm=${params.search}`
    );
    return response?.data;
  });
};