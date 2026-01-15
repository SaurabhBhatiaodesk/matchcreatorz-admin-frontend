import { Environments, IConfig } from "../types";
// export const PRODUCTION = process.env.NODE_ENV !== "production" ? false : true;

// PRODUCTION && (console.log = () => {});
export const Config: IConfig = {
  APP_NAME: "match-creator-admin",
  ACTIVE_ENV: Environments.LOCAL, // ??  Environments.STAGING,
  Enviroments: {
    [Environments.LOCAL]: {
      BASE_URL: "https://admin.backend.matchcreatorz.com",
      S3_BASE_URL: "https://matchcreatorz.s3.us-east-1.amazonaws.com/",
      SOCKET_URL: "https://chat.matchcreatorz.com",
    },
    [Environments.DEVELOPMENT]: {
     BASE_URL: "https://admin.backend.matchcreatorz.com",
     S3_BASE_URL: "https://matchcreatorz.s3.us-east-1.amazonaws.com/",
     SOCKET_URL: "https://chat.matchcreatorz.com",
    },
    [Environments.STAGING]: {
     BASE_URL: "https://admin.backend.matchcreatorz.com",
     S3_BASE_URL: "https://matchcreatorz.s3.us-east-1.amazonaws.com/",
     SOCKET_URL: "https://chat.matchcreatorz.com",
    },
    [Environments.PRODUCTION]: {
     BASE_URL: "https://admin.backend.matchcreatorz.com",
     S3_BASE_URL: "https://matchcreatorz.s3.us-east-1.amazonaws.com/",
     SOCKET_URL: "https://chat.matchcreatorz.com",
    },
  },
  TIMEOUT: 20000,
  DEFAULT_CURRENCY: "$",
  DEFAULT_COUNTRY_CODE: {
    iso: "US",
    countryCode: "+1",
  },
  DEFAULT_LAT_LNG: {
    latitude: 0.0,
    longitude: 0.0,
    latitudeDelta: 0.0,
    longitudeDelta: 0.0,
  },
  MEDIA_LOCATION: {
    ADMIN: "admin",
    PROFILE: "users",
    DOCUMENT: "docs",
    TESTIMONIAL: "testimonial",
  },
  apiUrl: () => `${Config.Enviroments[Config.ACTIVE_ENV].BASE_URL}`,
  mediaUrl: (media = "") =>
    `${Config.Enviroments[Config.ACTIVE_ENV].S3_BASE_URL}${media}`,
  socketUrl: () => `${Config.Enviroments[Config.ACTIVE_ENV].SOCKET_URL}`,
  APP_STORE_URL_IOS: () =>
    `https://apps.apple.com/app/${Config.APP_ANDROID_ID}`,
  APP_STORE_URL_ANDROID: () => `market://details?id=${Config.APP_ANDROID_ID}`,
};

export const ERROR_MSG = {
  NETWORK_ERROR:
    "We have detect something wrong with internet connectivity, please enable it",

  LOCATION_ERROR: "Please enable location from settings",

  SERVER_ERROR: "Something went wrong. Please try again.",

  SERVER_TIMEOUT: "Server is taking too much time to response",
};