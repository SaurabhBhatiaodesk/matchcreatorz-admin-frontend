export interface AdmitSettings {
  androidAppVersion: string;
  androidForceUpdate: boolean;
  iosAppVersion: string;
  iosForceUpdate: boolean;
  websiteVersion: string;
  maintenanceMode: boolean;
  languages?: [
    {
      name: string;
      value: string;
    }
  ];
}

export interface AdminSettingsResponse {
  success: boolean;
  data: AdmitSettings;
  message: string;
}

export interface AdminSettingsUpdateResponse {
    success: boolean;
    data: any;
    message: string;
  }
  