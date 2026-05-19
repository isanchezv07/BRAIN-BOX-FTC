interface ImportMetaEnv {
    readonly SUPABASE_URL: string
    readonly SUPABASE_KEY: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare namespace App {
    interface Locals {
        user: import("@supabase/supabase-js").User | null;
        profile: any | null;
    }
}