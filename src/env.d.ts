/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONFIG_GIST_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
