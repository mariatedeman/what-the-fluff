import { useEffect, useState } from "react";
import type { ApiError } from "../lib/apiError";
import { getIdentity } from "../services/tivoliService";
import type { IdentityResponse } from "../types/tivoli";

export function useIdentitySetup(token: string | null | undefined) {
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [loading, setLoading] = useState<"identity" | "session" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // STEP 1 — LOG TOKEN PRESENCE
    useEffect(() => {
      console.log(
        "%c[home] step 1 — identity_token:",
        "color: #06f",
        token ?? "(none — guest flow)",
      );
    }, [token]);
  
    // STEP 2 — FETCH IDENTITY WHEN TOKEN PRESENT
    useEffect(() => {
      if (!token) return;
      let cancelled = false;
  
      const fetchIdentity = async () => {
        console.log(
          "%c[home] step 2 — GET /identity-tokens/{token} ...",
          "color: #06f",
        );
        setLoading("identity");
        setError(null);
        try {
          const res = await getIdentity(token);
          console.log("%c[home] step 2 — identity response:", "color: #0a0", res);
          if (!cancelled) {
            setIdentity(res);
            sessionStorage.setItem("playerName", res.user.name);
          }
        } catch (err) {
          console.error("[home] step 2 — identity error:", err);
          if (!cancelled) {
            setError((err as ApiError).message ?? "Greet failed");
          }
        } finally {
          if (!cancelled) setLoading(null);
        }
      };
  
      fetchIdentity();
      return () => {
        cancelled = true;
      };
    }, [token]);
    
    return { identity, loading, setLoading, error, setError };
}
