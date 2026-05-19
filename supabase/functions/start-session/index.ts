import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import { json, preflight } from "../_shared/responses.ts";


// Deno.serve STARTS A WEBSERVER THAT LISTENS FOR INCOMING REQUESTS
Deno.serve(async (req) => {

  // HANDLING PREFLIGHT-REQUEST - CORS
  // BEFORE A REAL REQUEST IS MADE THE BROWSER ASKS FOR PERMISSION
  // WITH METHOD "OPTIONS"
  if (req.method === "OPTIONS") {
    return preflight();
  }


  // VALIDATE HTTP-METHOD - ONLY POST IS ALLOWED IN THIS FUNCTION
  if (req.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  // TRY
  // INSERT START-PLAYER-DATA
  try {

    // READ AND VALIDATE DATA - IF NOT CORRECT - CATCH WILL CATCH
    // EXPECT IT TO BE JSON-BODY WITH START-PLAYER-DATA NEEDED TO
    // BE INSERTED BEFORE GAME_SESSION START
    // PARSE JSON BODY. IF NOT VALID JSON req.json() THROWS AND
    // CATCH HANDLES IT
    const { player_name, difficulty, stake_amount, is_student } = await req.json();


    // VALIDATE INPUT TYPES BEFORE SENDING TO DB
    // IF NOT VALID RETURN 400 ERROR
    // INSTEAD OF LETTING POSTGRES REJECT WITH AN OPAQUE MESSAGE
    // Number.isFinite() REJECTS NaN AND Infinity (typeof === "number" DOES NOT)
    if (
      typeof player_name !== "string" ||
      player_name.trim().length === 0 ||
      !Number.isFinite(difficulty) || difficulty <= 0 ||
      !Number.isFinite(stake_amount) || stake_amount < 0 ||
      (is_student !== undefined && typeof is_student !== "boolean")
    ) {
      return json({ success: false, error: "Invalid input" }, 400);
    }

    //** CREATE SUPABASE-CLIENT **/
    // CREATES CONNECTION TO SUPABASE-DB
    // Deno.env.get() GETS SUPABASE URL AND KEY FROM SECURE STORE AT SUPABASE
    // SUPABASE_SERVICE_ROLE_KEY GIVES FULL ACCESS -
    // IGNORES RLS-POLICIES - NECCESARY IN SECURE SERVER-ENVIRONMENT
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );


    // CREATE A NEW ROW IN DB ("game_sessions") WITH START-PLAYER-DATA
    // .select("id") TO GET THE ID IN RETURN
    // .single() TO GET AN OBJECT INSTED OF AN ARRAY
    const { data, error } = await supabase
      .from("game_sessions")
      .insert({ player_name, difficulty, stake_amount, is_student })
      .select("id")
      .single();

    // ERROR HANDLING IF SUPABASE RETURNS AN ERROR
    if (error) {
      return json({ success: false, error: error.message }, 400);
    }

    // IF INSERT SUCCEDED - SEND BACK SUCCESS AND ID FROM GAME_SESSION
    return json({ success: true, data }, 200);

  } catch (err) {
    // IF CATCHES ANY ERRORS IN TRY - THE ERROR WILL BE RETURNED HERE
    return json({ success: false, error: (err as Error).message }, 500);
  }
});
