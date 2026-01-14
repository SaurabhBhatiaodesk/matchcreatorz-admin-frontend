export enum API_METHODS {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

// export type MethodsType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type MethodsType = (typeof API_METHODS)[keyof typeof API_METHODS];

export interface IApiRequest {
  method: MethodsType;
  endpoint: string;
  data?: { [key: string]: string | number };
  customHeaders?: { [key: string]: string | number };
}

export interface IHeaders {
  [key: string]: string | number;
}

export interface IEnvironmentsValues {
  BASE_URL: string;
  S3_BASE_URL: string;
  SOCKET_URL: string;
}
export interface IEnvironments {
  LOCAL: IEnvironmentsValues;
  DEVELOPMENT: IEnvironmentsValues;
  STAGING: IEnvironmentsValues;
  PRODUCTION: IEnvironmentsValues;
}
export enum Environments {
  LOCAL = "LOCAL",
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}
export type EnvironmentsType = (typeof Environments)[keyof typeof Environments];

export interface DEFAULT_COUNTRY {
  iso: string;
  countryCode: string;
}

export interface DEFAULT_COORDINATES {
  latitude: number;
  longitude: number;
  latitudeDelta?: number;
  longitudeDelta?: number;
}

export interface MEDIA_LOCATION_TYPES {
  ADMIN: string;
  PROFILE: string;
  DOCUMENT: string;
  TESTIMONIAL: string;
}

export interface IConfig {
  [x: string]: any;
  APP_NAME: string;
  APP_ANDROID_ID?: string;
  APP_IOS_ID?: string;
  ACTIVE_ENV: EnvironmentsType;
  Enviroments: IEnvironments;
  TIMEOUT: number;
  DEFAULT_CURRENCY: string;
  DEFAULT_COUNTRY_CODE: DEFAULT_COUNTRY;
  DEFAULT_LAT_LNG: DEFAULT_COORDINATES;
  MEDIA_LOCATION: MEDIA_LOCATION_TYPES;
  apiUrl: () => string;
  socketUrl: () => string;
  mediaUrl: (img?: string) => string;
  APP_STORE_URL_IOS: () => string;
  APP_STORE_URL_ANDROID: () => string;
}
