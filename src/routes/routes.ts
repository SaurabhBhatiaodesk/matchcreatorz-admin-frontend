import { lazy } from "react";
import { ROUTE_PATHS } from "./routePaths";

// Auth Pages
const SignIn = lazy(() => import("../pages/auth/Signin/SignIn"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgetPass/ForgetPass"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPass/ResetPassword"));

// Dashboard Pages
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Profile = lazy(() => import("../pages/dashboard/Account/Profile"));
const Settings = lazy(() => import("../pages/dashboard/Settings/Settings"));

// Buyers Pages
const BuyersList = lazy(() => import("../pages/dashboard/Buyers/BuyersList"));
const BuyersDetails = lazy(() => import("../pages/dashboard/Buyers/BuyersDetails"));
const BuyersAddEdit = lazy(() => import("../pages/dashboard/Buyers/BuyersAddEdit"));

// Sellers Pages
const SellersList = lazy(() => import("../pages/dashboard/Sellers/SellersList"));
const SellersDetails = lazy(() => import("../pages/dashboard/Sellers/SellersDetails"));
const SellerAddEdit = lazy(() => import("../pages/dashboard/Sellers/SellerAddEdit"));
const PortfolioAddEdit = lazy(() => import("../pages/dashboard/Sellers/SellerPortFolioAddEdit"));

// Booking Pages
const BookingList = lazy(() => import("../pages/dashboard/Booking/BookingList"));
const BookingDetails = lazy(() => import("../pages/dashboard/Booking/BookingDetails"));

// Banners Pages
const BannersList = lazy(() => import("../pages/dashboard/Banners/BannersList"));
const BannerAddEdit = lazy(() => import("../pages/dashboard/Banners/BannersAddEdit"));

// Content Pages
const Content = lazy(() => import("../pages/dashboard/Content/Content"));
const ContentDetails = lazy(() => import("../pages/dashboard/Content/ContentDetails"));

// Review Pages
const ReviewList = lazy(() => import("../pages/dashboard/Review/Reviews"));
const ReviewUser = lazy(() => import("../pages/dashboard/Review/UpdateReviews"));

// Report Pages
const ReportList = lazy(() => import("../pages/dashboard/Review/Reports"));

// Category Pages
const CategoryList = lazy(() => import("../pages/dashboard/Category/CategoryList"));
const CategoryDetails = lazy(() => import("../pages/dashboard/Category/CategoryDetails"));
const CategoryAddEdit = lazy(() => import("../pages/dashboard/Category/CategoryAddEdit"));

// Tag Pages
const TagList = lazy(() => import("../pages/dashboard/Tags/TagsList"));
const TagDetails = lazy(() => import("../pages/dashboard/Tags/TagsDetails"));
const TagAddEdit = lazy(() => import("../pages/dashboard/Tags/TagsAddEdit"));

// Connect Pages
const ConnectList = lazy(() => import("../pages/dashboard/Connect/ConnectList"));
const ConnectDetails = lazy(() => import("../pages/dashboard/Connect/ConnectDetails"));
const ConnectAddEdit = lazy(() => import("../pages/dashboard/Connect/ConnectAddEdit"));

// Notification Pages
const NotificationList = lazy(() => import("../pages/dashboard/Notification/NotificationList"));
const NotificationAdd = lazy(() => import("../pages/dashboard/Notification/NotificationAddEdit"));

// Support Pages
const SupportList = lazy(() => import("../pages/dashboard/Support/SupportList"));

// Withdraw Pages
const WithdrawList = lazy(() => import("../pages/dashboard/Withdraw/WithdrawList"));
const WithdrawDetails = lazy(() => import("../pages/dashboard/Withdraw/WithdrawDetails"));

// Statistics Pages
const StatisticsList = lazy(() => import("../pages/dashboard/Statistics/StatisticsList"));
const StatisticsDetails = lazy(() => import("../pages/dashboard/Statistics/StatisticsList"));

// Testimonial Pages
const TestimonialList = lazy(() => import("../pages/dashboard/Testimonial/TestimonialList"));
const TestimonialDetails = lazy(() => import("../pages/dashboard/Testimonial/TestimonialDetails"));
const TestimonialAddEdit = lazy(() => import("../pages/dashboard/Testimonial/TestimonialAddEdit"));

// Review Update Page
const ReviewUpdate = lazy(() => import("../pages/dashboard/Review/UpdateReviews"));

// Public Routes
export const publicRoutes = [
  {
    path: ROUTE_PATHS.LOGIN,
    element: SignIn,
  },
  {
    path: ROUTE_PATHS.FORGOT_PASSWORD,
    element: ForgotPassword,
  },
  {
    path: ROUTE_PATHS.RESET_PASSWORD,
    element: ResetPassword,
  },
];

// Private Routes
export const privateRoutes = [
  {
    path: ROUTE_PATHS.DASHBOARD,
    element: Dashboard,
  },
  {
    path: ROUTE_PATHS.ADMIN_PROFILE,
    element: Profile,
  },
  {
    path: ROUTE_PATHS.CHANGE_PASSWORD,
    element: Profile,
  },
  {
    path: ROUTE_PATHS.ADMIN_SETTINGS,
    element: Settings,
  },
  // Banners
  {
    path: ROUTE_PATHS.BANNERS_LIST,
    element: BannersList,
  },
  {
    path: ROUTE_PATHS.BANNERS_ADD,
    element: BannerAddEdit,
  },
  {
    path: ROUTE_PATHS.BANNERS_EDIT,
    element: BannerAddEdit,
  },
  // Bookings
  {
    path: ROUTE_PATHS.BOOKINGS_LIST,
    element: BookingList,
  },
  {
    path: ROUTE_PATHS.BOOKING_INFO,
    element: BookingDetails,
  },
  // Reviews
  {
    path: ROUTE_PATHS.REVIEWS_LIST,
    element: ReviewList,
  },
  {
    path: ROUTE_PATHS.REVIEW_USER_INFO,
    element: ReviewUser,
  },
  // Content Management
  {
    path: ROUTE_PATHS.CONTENT_MANAGEMENT,
    element: Content,
  },
  {
    path: ROUTE_PATHS.CONTENT_MANAGEMENT_DETAILS,
    element: ContentDetails,
  },
  {
    path: ROUTE_PATHS.CONTENT_EDIT_DETAILS,
    element: ContentDetails,
  },
  // Buyers
  {
    path: ROUTE_PATHS.BUYERS_LIST,
    element: BuyersList,
  },
  {
    path: ROUTE_PATHS.BUYERS_DETAILS,
    element: BuyersDetails,
  },
  {
    path: ROUTE_PATHS.BUYERS_EDIT_DETAILS,
    element: BuyersDetails,
  },
  {
    path: ROUTE_PATHS.BUYERS_ADD_EDIT,
    element: BuyersAddEdit,
  },
  // Sellers
  {
    path: ROUTE_PATHS.SELLERS_LIST,
    element: SellersList,
  },
  {
    path: ROUTE_PATHS.SELLERS_DETAILS,
    element: SellersDetails,
  },
  {
    path: ROUTE_PATHS.SELLERS_ADD_UPDATE,
    element: SellerAddEdit,
  },
  {
    path: ROUTE_PATHS.SELLERS_EDIT,
    element: SellerAddEdit,
  },
  {
    path: ROUTE_PATHS.SELLERS_PORTFOLIO_EDIT,
    element: PortfolioAddEdit,
  },
  // Category
  {
    path: ROUTE_PATHS.CATEGORY_LIST,
    element: CategoryList,
  },
  {
    path: ROUTE_PATHS.CATEGORY_DETAILS,
    element: CategoryDetails,
  },
  {
    path: ROUTE_PATHS.CATEGORY_ADD_UPDATE,
    element: CategoryAddEdit,
  },
  // Tag
  {
    path: ROUTE_PATHS.TAGS_LIST,
    element: TagList,
  },
  {
    path: ROUTE_PATHS.TAGS_DETAILS,
    element: TagDetails,
  },
  {
    path: ROUTE_PATHS.TAGS_ADD_UPDATE,
    element: TagAddEdit,
  },
  // Connect
  {
    path: ROUTE_PATHS.CONNECT_LIST,
    element: ConnectList,
  },
  {
    path: ROUTE_PATHS.CONNECT_DETAILS,
    element: ConnectDetails,
  },
  {
    path: ROUTE_PATHS.CONNECT_ADD_UPDATE,
    element: ConnectAddEdit,
  },
  // Notification
  {
    path: ROUTE_PATHS.NOTIFICATION_LIST,
    element: NotificationList,
  },
  {
    path: ROUTE_PATHS.NOTIFICATION_ADD,
    element: NotificationAdd,
  },
  // Support
  {
    path: ROUTE_PATHS.SUPPORT_LIST,
    element: SupportList,
  },
  // Withdraw
  {
    path: ROUTE_PATHS.WITHDRAW_LIST,
    element: WithdrawList,
  },
  {
    path: ROUTE_PATHS.WITHDRAW_DETAILS,
    element: WithdrawDetails,
  },
  // Statistics
  {
    path: ROUTE_PATHS.STATISTICS_LIST,
    element: StatisticsList,
  },
  {
    path: ROUTE_PATHS.STATISTICS_DETAILS,
    element: StatisticsDetails,
  },
  // Testimonials
  {
    path: ROUTE_PATHS.TESTIMONIAL_LIST,
    element: TestimonialList,
  },
  {
    path: ROUTE_PATHS.TESTIMONIAL_DETAILS,
    element: TestimonialDetails,
  },
  {
    path: ROUTE_PATHS.TESTIMONIAL_ADD_UPDATE,
    element: TestimonialAddEdit,
  },
  //Review
  {
    path: ROUTE_PATHS.REVIEW_UPDATE,
    element: ReviewUpdate,
  },
  // Report
   {
    path: ROUTE_PATHS.REPORT_LIST,
    element: ReportList,
  },
];
