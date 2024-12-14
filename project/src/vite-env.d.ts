/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POSTAL_API_KEY: string
  readonly VITE_POSTAL_SERVER_URL: string
  readonly VITE_POSTAL_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}