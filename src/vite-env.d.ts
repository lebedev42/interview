/// <reference types="vite/client" />

interface ImportMetaGlob {
  [key: string]: string;
}

interface ImportMeta {
  glob: (
    pattern: string,
    options?: { as?: string; eager?: boolean }
  ) => Record<string, any>;
}
