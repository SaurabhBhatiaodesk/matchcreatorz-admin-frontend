/// <reference types="vite/client" />

interface ImportMetaEnv {
  // readonly VITE_APP_TITLE: string;
  // readonly VITE_APP_API_URL: string;
  // readonly VITE_APP_S3_BASE_URL: string;
  // readonly VITE_APP_SOCKET_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
