/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_TIVOLI_USE_MOCK: string;
  readonly VITE_TIVOLI_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
