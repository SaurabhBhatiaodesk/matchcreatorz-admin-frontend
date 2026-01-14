import { useMutation } from "react-query";

import api from "../../services/api/ApIServices";
import { API_URLS } from "../../services/api/ApiUrls";
import { 
  BookingsListResponse,
  DetailsRequest,
  DetailsResponse,
  StatusUpdateRequest,
  StatusUpdatesResponse,
  ListRequest,
  ListResponse,
  BookingsListRequests,
} from "./usersInterface";


/* Seller */
export const useSellersList = () => {
   return useMutation(async (params: ListRequest) => {

   const response: { data: ListResponse } = await api.get(
     `${API_URLS.SELLERS_LIST}?pagination=${false}&skip=${params?.skip ?? 0}&limit=${params?.limit ?? 10} &activeStatus=ALL&sortBy=created&sortDirection=DESC&search=${params?.search}&startDate=${params?.startDate}&endDate=${params?.endDate}&categoryId=${params?.categoryId}&tagId=${params?.tagId}&responseTime=${params?.responseTime}&totalRating=${params?.totalRating}&profileStatus=${params?.profileStatus}
     `,
   );
   
   return response?.data;
 });
};

export const useSellersDetails = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response: { data: DetailsResponse } = await api.get(
      API_URLS.SELLERS_DETAILS + "/" + id
    );

    return response?.data;
  });
};

export const useSellersAddEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: DetailsResponse } = await api.put(
      API_URLS.SELLERS_ADD_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useSellerDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.SELLERS_IS_DELETED + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};

export const useSellerProfileStatus = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.post(
      API_URLS.SELLERS_PROFILE_STATUS,
      {...params}
    );
    return response?.data;
  });
};

export const useFAQAddEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: DetailsResponse } = await api.put(
      API_URLS.SELLERS_FAQ_ADD_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useFAQList = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response: { data: DetailsResponse } = await api.get(
      API_URLS.SELLERS_FAQ_LIST + "/" + id
    );
    return response?.data;
  });
};

export const useFAQDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.SELLERS_FAQ_DELETED + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};

export const usePortfolioDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.SELLERS_PORTFOLIO_DELETED + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};


export const usePortfolioList = () => {
  return useMutation(async ({ id }: DetailsRequest) => {
    const response: { data: DetailsResponse } = await api.get(
      API_URLS.SELLERS_PORTFOLIO_LIST + "/" + id
    );
    return response?.data;
  });
};

export const usePortfolioAddEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: DetailsResponse } = await api.put(
      API_URLS.SELLERS_PORTFOLIO_ADD_UPDATE,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useSellerStatusUpdate = () => {
  return useMutation(async ({ id }: StatusUpdateRequest) => {
    const response: { data: StatusUpdatesResponse } = await api.get(
      API_URLS.SELLERS_ACCOUNT_STATUS_CHANGE + "/" + id
    );
    return response?.data;
  });
};


/* Buyer */
export const useBuyerList = () => {
  return useMutation(async (params: ListRequest) => {
    const response: { data: ListResponse } = await api.get(
      `${API_URLS.BUYERS_LIST}?pagination=${false}&skip=${params.page ?? 0}&limit=${params?.limit ?? 10}&activeStatus=ALL&sortBy=id&sortDirection=DESC&search=${params?.search}&startDate=${params?.startDate}&endDate=${params?.endDate}`,
    );
    return response?.data;
  });
};

export const useBuyersAddEdit = () => {
  return useMutation(async (params: any) => {
    const response: { data: DetailsResponse } = await api.put(
      API_URLS.BUYERS_ADD_EDIT,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useBuyerDelete = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.delete(
      API_URLS.BUYERS_IS_DELETED + "/" + params?.id,
      {}
    );
    return response?.data;
  });
};

export const useBuyerStatusUpdate = () => {
  return useMutation(async ({ id }: any) => {
    const response: { data: StatusUpdatesResponse } = await api.get(
      API_URLS.BUYERS_ACCOUNT_STATUS_CHANGE + "/" + id
    );
    return response?.data;
  });
};

export const useBuyerDetails = () => {
  return useMutation(async ({ id }: any) => {
    const response: { data: any } = await api.get(
      API_URLS.BUYERS_DETAILS + "/" + id
    );
    return response?.data;
  });
};

export const useTopPalsList = () => {
  return useMutation(async (params: ListRequest) => {
    const response: { data: ListResponse } = await api.post(
      API_URLS.BUYERS_LIST + "/isFeatured",
      {
        ...params,
      }
    );
    return response?.data;
  });
};


// booking api
export const useBookingsList = () => {
  return useMutation(async (params: BookingsListRequests) => {
    const response: { data: BookingsListResponse } = await api.get(
      `${API_URLS.BOOKINGS_LIST}?pagination=${params?.pagination ?? true}&skip=${params?.page ?? 0}&limit=${params?.limit ?? 10}&bookingType=${params?.status ?? 'All'}&sortDirection=${params?.sortBy ?? 'DESC'}&bookingSubStatus=${params?.subStatus}&searchTerm=${params?.search}`,
    );
    return response?.data;

  });
};

// booking details
export const useBookingsDetails = () => {
  return useMutation(async (params: any) => {
    const response: { data: BookingsListResponse } = await api.get(
      `${API_URLS.BOOKINGS_DETAILS}/${params?.id}`,
    );
    return response?.data;
  });
};

// booking settle 
export const useBookingsUpdateStatus = () => {
  return useMutation(async (params: any) => {
    const response: { data: BookingsListResponse } = await api.post(
      API_URLS.BOOKINGS_UPDATE_STATUS, 
      {
        ...params
      }
    );
    return response?.data;
  });
};

//wallet 
export const useAddWalletAmount = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.put(
      API_URLS.WALLET_ADD_AMOUNT,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

//WalletTxn
export const useWalletTransactionList = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.get(
      `${API_URLS.TRANSACTION_HISOTRY}?pagination=${params.pagination}&skip=${params.skip}&limit=${params.limit}&id=${params.id}`,
    );
    return response?.data;
  });
};


export const useUsersList = () => {
  return useMutation(async (params: ListRequest) => {
  const response = await api.get(
    `${API_URLS.USERS_LIST}?pagination=${false}&skip=${params?.page ?? 1}&limit=${params?.limit ?? 10}&activeStatus=ALL&sortBy=id&sortDirection=DESC`,
  );
  return response?.data;
});
};

//Connect
export const useGetConnectList = () => {
  return useMutation(async () => {
    const response: { data: any } = await api.get(
      `${API_URLS.GET_CONNECT}`,
    );
    return response?.data;
  });
};

export const useAddConnect = () => {
  return useMutation(async (params: any) => {
    const response: { data: any } = await api.put(
      API_URLS.CONNECT_ADD_AMOUNT,
      {
        ...params,
      }
    );
    return response?.data;
  });
};

export const useConnectTransactionList = () => {
  return useMutation(async (params: ListRequest) => {
    const response: { data: any } = await api.get(
      `${API_URLS.CONNECT_TRANSACTION_HISOTRY}?pagination=true&skip=${params.skip}&limit=${params.limit}&userId=${params.id}`,
    );
    return response?.data;
  });
};
