const RoutePaths = {
  // PUBLIC ROUTE PATHS
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp/:id",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:id",

  USERS_LIST: "/user",
  TOP_USERS: "/top-user",
  USERS_PROFILE: "/user/profile/",
  USERS_DETAILS: "/user/profile/:id",
  USERS_EDIT: "/user/profile/edit/",
  USERS_EDIT_DETAILS: "/user/profile/edit/:id",

  // Buyers
  BUYERS_LIST: "/buyers",
  TOP_BUYERS: "/top-buyers",
  BUYERS_PROFILE: "/buyers/profile/",
  BUYERS_DETAILS: "/buyers/profile/:id",
  BUYERS_EDIT: "/buyers/profile/edit/",
  BUYERS_ADD_EDIT: "/buyers/add-edit",
  BUYERS_EDIT_DETAILS: "/buyers/profile/edit/:id",

  // Sellers
  SELLERS_LIST: "/sellers",
  TOP_SELLERS: "/top-sellers",
  SELLERS_PROFILE: "/sellers/profile/",
  SELLERS_DETAILS: "/sellers/profile/:id",
  SELLERS_EDIT: "/sellers/profile/edit",
  SELLERS_ADD_UPDATE: "/sellers/add-edit",
  SELLERS_PORTFOLIO_PROFILE: "/sellers/protfolio/profile/",
  SELLERS_PORTFOLIO_EDIT: "/sellers/protfolio/edit/",

  // Category
  CATEGORY_LIST: "/category",
  CATEGORY_PROFILE: "/category/details/",
  CATEGORY_DETAILS: "/category/details/:id",
  CATEGORY_ADD_UPDATE: "/category/add-edit",
  TAGS_LIST: "/category/tags",
  TAGS_PROFILE: "/category/tags/",
  TAGS_DETAILS: "/category/tags/:id",
  TAGS_ADD: "/category/tags/add-edit/",
  TAGS_ADD_UPDATE: "/category/tags/add-edit/:id",

  //   PRIVATE ROUTE PATHS
  DASHBOARD: "/dashboard",
  ADMIN_PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  ADMIN_SETTINGS: "/admin-settings",

  TRAVELLERS_LIST: "/travellers",
  TRAVELLER_PROFILE: "/travellers/profile/",
  TRAVELLER_DETAILS: "/travellers/profile/:id",

  BOOKINGS_LIST: "/bookings",
  BOOKING_DETAILS: "/bookings/details",
  BOOKING_INFO: "/bookings/details/:id",

  BANNERS_LIST: "/banners",
  BANNERS_ADD: "/banners/add",
  BANNERS_EDIT: "/banners/banner-edit",

  PLACES_LIST: "/places",
  PLACE_INFO: "/places/place-details",
  PLACE_DETAILS: "/places/place-details/:placeId",
  PLACE_INFO_EDIT: "/places/place-edit",
  PLACE_EDIT: "/places/place-edit/:placeId",

  COUNTRIES_LIST: "/countries",
  COUNTRY_ADD: "/countries/add",
  COUNTRY_EDIT: "/countries/edit",

  CITIES_LIST: "/cities",
  CITY_ADD: "/cities/add",
  CITY_EDIT: "/cities/edit",

  REVIEWS_LIST: "/reviews",
  REVIEW_INFO: "/reviews/infor",
  REVIEW_USER_INFO: "/reviews/review-user/:id",
  REVIEW_DETAILS: "/reviews/reviews-details",
  REVIEW_DETAILS_INFO: "/reviews/reviews-details/:id",

  REPORT_LIST: "/reports",

  CONTENT_MANAGEMENT: "/content-management/",
  CONTENT_MANAGEMENT_DETAILS: "/content-management/:pageName",
  CONTENT_EDIT: "/content-management/edit/",
  CONTENT_EDIT_DETAILS: "/content-management/edit/:pageName",

  CONTACT_US: "/contact-us/",

  TEXT_SETTIGNS: "/text-settings/",
  TEXT_SETTIGNS_EDIT: "/text-settings/edit",

  // Connect
  CONNECT_LIST: "/connect",
  CONNECT_PROFILE: "/connect/details/",
  CONNECT_DETAILS: "/connect/details/:id",
  CONNECT_ADD_UPDATE: "/connect/add-edit",

  // Notification
  NOTIFICATION_LIST: "/notification",
  NOTIFICATION_ADD: "/notification/add",

  // Notification
  SUPPORT_LIST: "/support",

  // Withdraw
  WITHDRAW_LIST: "/withdraw",
  WITHDRAW_INFO: "/withdraw/info/",
  WITHDRAW_DETAILS: "/withdraw/info/:id",

  // Statistics
  STATISTICS_LIST: "/statistics",
  STATISTICS_INFO: "/statistics/infor",
  STATISTICS_USER_INFO: "/statistics/review-user/:id",
  STATISTICS_DETAILS: "/statistics/reviews-details",
  STATISTICS_DETAILS_INFO: "/statistics/reviews-details/:id",

  // Testimonials
  TESTIMONIAL_LIST: "/testimonial",
  TESTIMONIAL_PROFILE: "/testimonial/details/",
  TESTIMONIAL_DETAILS: "/testimonial/details/:id",
  TESTIMONIAL_ADD_UPDATE: "/testimonial/add-testimoials",
  TESTIMONIAL_DELETE: "/testimonial/delete-testimonials",

  // Review
  REVIEW_UPDATE: "/reviews/update"

} as const;

export const ROUTE_PATHS: typeof RoutePaths = RoutePaths;
