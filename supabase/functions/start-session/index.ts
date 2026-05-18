import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";


//** CORS-SETTINGS **/
// HEADERS NEEDED TO MAKE BROWSER ALLOW OUR WEBBAPP TO MAKE REQUEST
// TO EDGE-FUNCTION AT SUPABASE
// (WEBB-APP AND EDGE-FUNCTION = DIFFERENT ORIGINS)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // ALLOW REQUEST FROM ALL ORIGINS
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type", // ALLOW SPECIFIC HEADERS FOR REQUEST
  "Access-Control-Allow-Methods": "POST, OPTIONS", // ALLOW POST- AND OPTIONS-METHODS.
};


// Deno.serve STARTS A WEBSERVER THAT LISTENS FOR INCOMING REQUESTS
Deno.serve(async (req) => {

  // HANDLING PREFLIGHT-REQUEST - CORS
  // BEFORE A REAL REQUEST IS MADE (EG POST) THE BROWSER 
  // ASK FOR PERMISSION 
  // WITH METHOD "OPTIONS"
  // RETURN OK AND SEND OUR CORS-HEADERS TO GIVE PERMISSION

  // NON SIMPLE REQUESTS - PREFLIGHT REQUESTS - CROSS-ORIGIN- HTTP-REQUESTS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }


  // VALIDATE HTTP-METHOD - ONLY POST IS ALLOWED IN THIS FUNCTION
  // 405 - METHOD NOT ALLOWED
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // TRY 
  // INSERT START-PLAYER-DATA
  try {

    // READ AND VALIDATE DATA - IF NOT CORRECT - CATCH WILL CATCH
    // EXPECT IT TO BE JSON-BODY WITH START-PLAYER-DATA NEEDED TO
    // BE INSERTED BEFORE GAME_SESSION START
    // PARSE JSON BODY. IF NOT VALID JASON req.json() THROWS AND
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
      return new Response(
        JSON.stringify({ success: false, error: "Invalid input" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
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
    // THEN SEND BACK THE ERROR
    // 400 - BAD REQUEST
    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // IF INSERT SUCCEDED - SEND BACK SUCCESS AND ID FROM GAME_SESSION
    // 200 - OK
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {

    // IF CATCHES ANY ERRORS IN TRY - THE ERROR WILL BE RETURNED HERE
    // 500 - INTERNAL SERVER ERROR
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
