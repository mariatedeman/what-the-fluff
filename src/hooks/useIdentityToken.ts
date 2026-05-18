import { useState, useEffect } from "react";
import type { IdentityToken } from "../types/tivoli";


// CAPTURED ONCE AT MODULE LOAD - STABLE ACROSS StrictMode's DEV DOUBLE-MOUNT
// (LAZY useState INIT WOULD RE-RUN AND READ null FROM THE ALREADY-STRIPPED URL)
const initialToken: IdentityToken | null = (() => {
  const params = new URLSearchParams(window.location.search);
  return params.get("identity_token");
})();


// READ identity_token FROM URL, THEN STRIP IT FROM URL
export function useIdentityToken(): IdentityToken | null {
  const [token] = useState<IdentityToken | null>(initialToken);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("identity_token")) return;

    // KEEP OTHER QUERY-PARAMS AND HASH INTACT
    params.delete("identity_token");
    const newSearch = params.toString();
    const newUrl =
      window.location.pathname +
      (newSearch ? `?${newSearch}` : "") +
      window.location.hash;

    // PRESERVE history.state SO React Router NAV STATE IS NOT LOST
    window.history.replaceState(window.history.state, "", newUrl);
  }, []);

  return token;
}
