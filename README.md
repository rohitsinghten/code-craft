# CodeCraft

CodeCraft is a Next.js code editor with Monaco, Convex-backed snippets/history, Clerk auth, and optional remote code execution providers.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill the required Clerk and Convex values.

3. Keep Clerk keys paired. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` must come from the same Clerk app and environment. If Clerk logs `token-not-active-yet`, sync the machine clock before debugging app code.

4. Sync Convex after any change in `convex/`:

   ```bash
   npm run convex:sync
   ```

   If the browser logs `Could not find public function for 'codeExecutions:checkAndIncrementRateLimit'`, the app code and Convex deployment are out of sync. Run the sync command, then restart `npm run dev`.

5. Start Next.js:

   ```bash
   npm run dev
   ```

## Checks

```bash
npm run typecheck
npm run lint
npm run test:e2e
```
