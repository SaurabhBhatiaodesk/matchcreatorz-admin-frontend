const URLS = {
  // admin auth api
  LOGIN: "auth/login",
  LOGOUT: "auth/log-out",
  VERIFY_OTP: "auth/verify-otp",
  FORGOT_PASSWORD: "auth/forgot-password",
  RESET_PASSWORD: "auth/reset-password",
  RESEND_OTP: "auth/resend-otp",

  // admin profile api
  ADMIN_PROFILE: "auth/profile",
  UPDATE_PROFILE: "auth/update-profile",
  CHANGE_PASSWORD: "auth/change-password",

  // admin settings api
  ADMIN_SETTINGS: "settings",
  ADMIN_SETTINGS_UPDATE: "settings",
  ADMIN_PRICE_RANGE_UPDATE: "settings/price-range/add-edit",
  ADMIN_RESPONSE_TIME_UPDATE: "settings/response-time/add-edit",
  ADMIN__PRICE_RANGE: "settings/price-range",
  ADMIN_RESPONSE_TIME: "settings/response-time",
  ADMIN__PRICE_RANGE_DELETE: "settings/price-range/delete",
  ADMIN_RESPONSE_TIME_DELETE: "settings/response-time/delete",

  // dashboard api
  DASHBOARD: "auth/dashboard",

  // statistic api
  STATISTIC: "statistics",

  // buyers api
  BUYERS_LIST: "buyers",
  BUYERS_DETAILS: "buyers",
  BUYERS_ADD_EDIT: "buyers/add-edit",
  BUYERS_ACCOUNT_STATUS_CHANGE: "buyers/update-status",
  BUYERS_IS_DELETED: "buyers",

  // seller api
  SELLERS_LIST: "sellers",
  SELLERS_DETAILS: "sellers",
  SELLERS_ADD_UPDATE: "sellers/add-edit",
  SELLERS_ACCOUNT_VERIFY: "sellers/verify",
  SELLERS_ACCOUNT_STATUS_CHANGE: "sellers/update-status",
  SELLERS_IS_DELETED: "sellers/delete",
  SELLERS_PROFILE_STATUS: "sellers/profile-status",

  SELLERS_FAQ_LIST: "sellers/faq",
  SELLERS_FAQ_ADD_UPDATE: "sellers/faq/update-faq",
  SELLERS_FAQ_DELETED: "sellers/faq/delete",

  SELLERS_PORTFOLIO_LIST: "sellers/portfolio/get-portfolio",
  SELLERS_PORTFOLIO_ADD_UPDATE: "sellers/portfolio/update-portfolio",
  SELLERS_PORTFOLIO_DELETED: "sellers/portfolio/delete",

  // wallet transaction
  WALLET_ADD_AMOUNT: "wallet/add-amount",
  TRANSACTION_HISOTRY: "wallet/transaction-history",

  // connect transaction
  GET_CONNECT: "wallet/get-connects",
  CONNECT_ADD_AMOUNT: "wallet/add-connects",
  CONNECT_TRANSACTION_HISOTRY: "wallet/get-connects-transactions",

  // category api
  CATEGORY_LIST: "category",
  CATEGORY_DETAILS: "category/details",
  CATEGORY_ADD_UPDATE: "category/add-edit",
  CATEGORY_STATUS_CHANGE: "category/update-status",
  CATEGORY_DELETE: "category/delete/:id",

  // tags api
  TAGS_LIST: "category/tags",
  TAGS_DETAILS: "category/tags",
  TAGS_ADD_EDIT: "category/tags/add-edit",
  TAGS_STATUS_CHANGE: "category/tags/update-status",
  TAGS_DELETE: "category/tags/:id",
  TAGS_LIST_FOR_FILTER: "category/tags-list",

  // Bookings api
  BOOKINGS_LIST: "booking",
  BOOKINGS_DETAILS: "booking/details",
  BOOKINGS_UPDATE_STATUS: "booking/update-status",
  // BOOKINGS_DOWNLOAD: "booking/download",

  // Content-Management / Static Pages api
  PAGES_LIST: "pages",
  PAGES_ADD: "pages",
  PAGE_EDIT: "pages/edit",
  PAGES_DELETE: "pages/delete",
  PAGE_STATUS_UPDATE: "pages/update-status",

  // Country / City Management api
  COUNTRIES_LIST: "auth/get-country",

  // Rate & Review Management Api
  RATINGS_REVIEWS_LIST: "reviews",
  RATINGS_REVIEWS_DELETE: "reviews/delete",
  RATINGS_REVIEWS_UPDATE: "reviews/update",
  REPORT_LIST: "resource/get-reports",

  // Banner Management Api
  BANNERS_LIST: "resource/get-banners",
  BANNER_ADD: "resource/add-banner",
  BANNER_VIEW: "resource/view-banners",
  BANNER_UPDATE: "resource/update-banners",
  BANNER_DELETE: "resource/delete-banner",
  BANNER_STATUS_UPATE: "resource/update-status",

  // Connects api
  CONNECT_LIST: "connects",
  CONNECT_DETAILS: "connects/details",
  CONNECT_ADD_UPDATE: "connects/add-edit",
  CONNECT_STATUS_CHANGE: "connects/update-status",
  CONNECT_DELETE: "connects/delete",

  // Upload api
  UPLOAD_FILE_URL: "utils/s3-upload-urls",

  // Resource api
  RES_CATEGORY: "resource/get-category",
  RESPONSE_LIST: "resource/get-response-time",
  PRICE_RANGE_LIST: "resource/get-price-range",
  CITY_LIST: "resource/get-city",
  STATE_LIST: "resource/state-list",
  COUNTRY_LIST: "resource/country-list",
  RES_TAGS: "resource/get-tags",

  // Notification api
  SEND_NOTIFICATION: "resource/send-notifications",
  GET_NOTIFICATION: "resource/get-notifications",
  NOTIFICATION_DELETED: "resource/notification/delete",
  DASH_GET_NOTIFICATION: "resource/get-dashboard-notifications",

  // User api
  USERS_LIST: "users",

  // Withdraw api
  WITHDRAW_LIST: "wallet/withdraw/withdraw-list",
  WITHDRAW_STATUS_CHANGE: "wallet/withdraw/update-status",
  WITHDRAW_DETAILS: "wallet/withdraw/info",

  // Testimonial api
  TESTMONIAL_LIST: "resource/get-testimonials",
  TESTMONIAL_DELETE: "resource/delete-testimonials",
  TESTMONIAL_ADD: "resource/add-testimonials",
} as const;

export const API_URLS: typeof URLS = URLS;
