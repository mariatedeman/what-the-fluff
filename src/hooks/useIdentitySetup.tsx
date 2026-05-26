import { useEffect, useState } from "react";
import { ApiError } from "../lib/apiError";
import { getIdentity } from "../services/tivoliService";
import type { IdentityResponse } from "../types/tivoli";

export type IdentityLoading = "identity" | "session" | null;

export type UseIdentitySetupResult = {
  identity: IdentityResponse | null;
  loading: IdentityLoading;
  error: string | null;
  setLoading: React.Dispatch<React.SetStateAction<IdentityLoading>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

export function useIdentitySetup(
  token: string | null | undefined,
): UseIdentitySetupResult {
  const [identity, setIdentity] = useState<IdentityResponse | null>(null);
  const [loading, setLoading] = useState<IdentityLoading>(null);
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
          setError(err instanceof ApiError ? err.message : "Greet failed");
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
