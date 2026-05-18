import { supabase } from "./supabase";
import type { ApiError } from "../types/api";


// GENERIC HELPER FOR INVOKING SUPABASE EDGE FUNCTIONS WITH TYPED RESPONSES (in /services/tivoliService.ts)
export async function invokeEdge<T>(
  name: string,
  body?: object
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    throw { message: error.message } satisfies ApiError;
  }
  return data as T;
}
