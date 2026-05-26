import { useEffect, useState } from "react";
import type { ApiError } from "../lib/apiError";
import { getIdentity } from "../services/tivoliService";
import type { IdentityResponse } from "../types/tivoli";

export function useIdentitySetup(token: string | null | undefined) {
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [loading, setLoading] = useState<"identity" | "session" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const fetchIdentity = async () => {
      setLoading("identity");
      setError(null);
      try {
        const res = await getIdentity(token);
        if (!cancelled) {
          setIdentity(res);
          sessionStorage.setItem("playerName", res.user.name);
        }
      } catch (err) {
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
