// Local fallback env typing for Codespaces/blocked npm environments.
// We intentionally avoid `/// <reference types="vite/client" />` so this file
// still works even when dependencies are not installed yet.

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
