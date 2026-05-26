# What the Fluff ☁️

A web-based amusement game built for the Tivoli ecosystem. Catch the falling cotton candy to earn points, compete on the leaderboard, and win stamps!

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend/Services**: Supabase (Database & Edge Functions), Deno
- **Integrations**: Tivoli API (Central Bank) for Identity Tokens, Stamps, and Payouts.

## Features

- **Interactive Game**: Control the catcher using keyboard, mouse, or touch.
- **Score System**: Leaderboard and highscore tracking integrated through Supabase.
- **Tivoli Economy**: Earn payouts by catching items, handling real money via the Tivoli Central Bank.
- **Accessible Design**: Fully keyboard accessible (WCAG 2.1 AAA target sizes, focus configurations).

## Getting Started

To run this project locally, make sure you have an `.env` file set up with the required variables (Supabase connections and `VITE_TIVOLI_API_BASE_URL`).

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

## Team

- **Frontend:** Maria Tedeman (mariatedeman)
- **Backend:** Hanna Johansson (HannaJ95)
