import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight } from "../_shared/responses.ts";
import type { TablesInsert } from "../_shared/database.ts";


type SessionInsert = TablesInsert<"game_sessions">;


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return preflight();
  }

  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const { player_name, stake_amount, is_student } = await req.json();

    if (
      typeof player_name !== "string" || player_name.trim().length === 0 ||
      !Number.isFinite(stake_amount) || stake_amount < 0 ||
      typeof is_student !== "boolean"
    ) {
      return json({ success: false, error: "Invalid input" }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const row: SessionInsert = { player_name, stake_amount, is_student };

    const { data, error } = await supabase
      .from("game_sessions")
      .insert(row)
      .select("id")
      .single();

    if (error) {
      return json({ success: false, error: error.message }, 400);
    }

    return json({ success: true, data }, 200);

  } catch (err) {
    return json({ success: false, error: (err as Error).message }, 500);
  }
});
