export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          from_api: boolean;
        };
      };
      scores: {
        Row: {
          id: number;
          created_at: string;
          user_id: number;
          score: number;
        };
      };
    };
  };
}
