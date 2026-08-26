/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_USE_BACKEND_AI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
