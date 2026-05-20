import { ApiError } from "../types/api";


export type TivoliEndpoint = "transaction" | "payout" | "identity";


export function getTivoliErrorMessage(
  err: unknown,
  endpoint: TivoliEndpoint
): string {
  if (!(err instanceof ApiError)) {
    return "Something went wrong. Please try again.";
  }

  if (endpoint === "transaction") {
    switch (err.status) {
      case 401:
        return "Your Tivoli session has expired. Go back to Tivoli and try again.";
      case 402:
        return "You don't have enough money in your Tivoli account.";
      case 409:
        return "We can't process this right now. Please try again later.";
      case 422:
        return "Something in the request was invalid. Please try again.";
    }
  }

  if (endpoint === "payout") {
    switch (err.status) {
      case 401:
        return "We can't process this right now. Please try again later.";
      case 409:
        return "This transaction has already been completed.";
    }
  }

  if (endpoint === "identity") {
    switch (err.status) {
      case 401:
        return "Your Tivoli session has expired. Go back to Tivoli and try again.";
    }
  }

  return err.message || "Something went wrong. Please try again.";
}
