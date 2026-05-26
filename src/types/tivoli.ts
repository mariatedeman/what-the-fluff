// Wire types live in supabase/functions/_shared/tivoli.ts so they're the
// single source of truth for both frontend AND edge functions. This file
// just re-exports them so frontend imports stay short:
// `import type { ... } from "../types/tivoli"`.
export type * from "../../supabase/functions/_shared/tivoli.ts";
