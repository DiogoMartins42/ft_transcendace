/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  // add other vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
