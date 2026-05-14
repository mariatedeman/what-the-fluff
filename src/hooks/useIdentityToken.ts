import { useState, useEffect } from "react";
import type { IdentityToken } from "../types/tivoli";


// REACT-HOOK THAT READS identity_token FROM THE URL QUERY STRING
export function useIdentityToken(): IdentityToken | null {

  // LAZY INITIAL STATE - RUNS ONCE ON FIRST RENDER, BEFORE useEffect FIRES
  const [token] = useState<IdentityToken | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("identity_token");
  });


  // RETURN NULL OR TOKEN
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // RETURNS NULL IF NO identity_token FOUND
    if (!params.has("identity_token")) return;

    // STRIP identity_token FROM THE URL AFTER MOUNT
    // KEEPS ANY OTHER QUERY-PARAMS AND THE hash INTACT
    params.delete("identity_token");
    const newSearch = params.toString();
    const newUrl =
      window.location.pathname +
      (newSearch ? `?${newSearch}` : "") +
      window.location.hash;

    // history.replaceState UPDATES THE URL IN-PLACE WITHOUT NAVIGATING / RELOADING
    window.history.replaceState({}, "", newUrl);
  }, []);


  return token;
}
