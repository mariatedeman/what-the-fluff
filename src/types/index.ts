import type { Tables } from "./database";

// User table and score table from database
export type User = Tables<"users">;
export type Score = Tables<"scores">;

// Score with users name
export type ScoreWithUser = Score & {
  users: Pick<User, "name">;
};

