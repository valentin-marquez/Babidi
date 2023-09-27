/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly SENDER_KEY: string;
}


interface ImportMeta {
    readonly env: ImportMetaEnv;
}