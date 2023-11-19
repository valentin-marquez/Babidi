/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly DATABASE_URL: string;
    readonly WEB_URL: string;
}


interface ImportMeta {
    readonly env: ImportMetaEnv;
}